import traceback
import time
import timeit
import os
import math
import requests
import json
import itertools
import urllib.request
from urllib.parse import unquote
from datetime import date, datetime, timedelta
from dateutil.relativedelta import *
import pandas as pd
import pandas_market_calendars as mcal
import yfinance as yf
from http import HTTPStatus
from django.core.exceptions import PermissionDenied, BadRequest, ObjectDoesNotExist
from django.http import HttpResponse
#from django_pandas.io import read_frame

# Create your views here.

class BarchartAPI():

	def __init__(self):
		self.session = requests.Session()
		self.getheaders = {
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9',
			'cache-control': 'max-age=0',
			'upgrade-insecure-requests': '1',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
		}
		self.getpay = {
			'page': 'all'
		}
		self.headers = {
			'accept': 'application/json',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9',
			'referer': None,
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
			'x-xsrf-token': None 
		}

	def sendRequest(self, request_url, response_url, params):
		session = self.session
		request = session.get(request_url, params=self.getpay, headers=self.getheaders)
		request.raise_for_status()
		headers = self.headers
		headers['x-xsrf-token'] = unquote(unquote(request.cookies.get_dict()['XSRF-TOKEN']))
		response = session.get(response_url, params=params, headers=headers)
		return response


class ZeroDteData(BarchartAPI):

	def __init__(self, symbol, asset_type, quote_ticker):
		super().__init__()

		today = date.today()
		next_day = today + timedelta(days=1)
		self.today = date.today().strftime("%Y-%m-%d")
		self.next_day = next_day.strftime("%Y-%m-%d")

		self.symbol = symbol
		self.asset_type = asset_type
		self.quote_ticker = quote_ticker

		self.request_url = 'https://www.barchart.com/{}/quotes/{}/options'.format(self.asset_type, self.symbol)
		self.response_url = 'https://www.barchart.com/proxies/core-api/v1/options/get'

		self.options_params = {
			'baseSymbol': self.symbol,
			'fields': None,
			'groupBy': 'optionType',
			'expirationDate': None,
			'meta': 'expirations',
			'orderBy': 'strikePrice',
			'orderDir': 'asc',
			'raw': None
		}
		
		self.options_fields = 'strikePrice,volume,openInterest,volumeOpenInterestRatio,volatility,optionType'
		self.greeks_fields = 'strikePrice,theoretical,delta,gamma,rho,theta,vega,optionType,'
		self.front_expiration = None
		self.period = None


	def return_data(self, fields, expiration_date):
		params = self.options_params
		params['fields'] = fields
		params['expirationDate'] = expiration_date

		response = super().sendRequest(request_url=self.request_url, response_url=self.response_url, params=params)
		if response.status_code == 429:
			print("API Request taking quick nap...")
			time.sleep(10)
			print("API Request firing up again for second try...")
			try:
				response = super().sendRequest(request_url=self.request_url, response_url=self.response_url, params=params)
				response.raise_for_status()
			except Exception:
				print(traceback.format_exc())
				return response
			else:
				json = response.json()
				return json

		elif response.status_code == 200:
			json = response.json()
			return json
		else:
			print(response.status_code)
			return response


	def get_spot_price(self):
		ticker = yf.Ticker(self.quote_ticker)
		price = ticker.history(period='1d')
		spot_price = price['Close'][0]
		return spot_price

	def check_market_open(self):
		start = date.today() - timedelta(days=3)
		end = date.today() + timedelta(days=5)
		nyse = mcal.get_calendar('NYSE')
		market_dates = nyse.schedule(start_date=start, end_date=end)

		if self.today in market_dates.index:
			return True
		else:
			return False


	def check_front_expiration_date(self):
		json = self.return_data(fields=self.options_fields, expiration_date=self.today)
		if json['data']:
			self.front_expiration = self.today
			return self.today
		else:
			json = self.return_data(fields=self.options_fields, expiration_date=self.next_day)
			if json['data']:
				self.front_expiration = self.next_day
				return self.next_day
			else:
				return False


	def confirm_front_expiration_date(self):
		periods = ['weekly', 'monthly']
		for period in periods:
			json = self.return_data(fields=self.options_fields, expiration_date="nearest")
			expiry = json['meta']['expirations'][period][0]
			if expiry == self.front_expiration:
				self.period = period
				return True
			else:
				print(f"No expirations for {self.symbol} match today's data.")
				return False


	def clean_data(self, data):
		dataframes = []
		for opt_type in data.keys():
			df = pd.json_normalize(data, record_path=opt_type)
			df = df.replace(['%', ','], '', regex=True)
			df = df.set_index(['optionType', 'strikePrice'])
			dataframes.append(df)

		df = pd.concat(dataframes)
		df.sort_index(inplace=True)
		objs = df.select_dtypes(object).columns
		df[objs] = df[objs].apply(pd.to_numeric, errors='coerce')
		df = df.fillna(0)
		return df


	def get_derivatives_data(self, data_type, fields):
		print(f"Getting {data_type} data for {self.symbol}.")
		json = self.return_data(fields=fields, expiration_date=self.front_expiration)
		data = json['data']
		if isinstance(data, dict):
			df = self.clean_data(data=data)
			return df
		else:
			print(f"Error with {data_type} data json response - did not return a dictionary.")
			return data
		

	def get_chart_data(self, dataframe, contract, spot_price):
		df = dataframe
		cols = df.columns.tolist()
		for col in cols:
			df = df.rename(columns={col: f"{contract}{col.capitalize()}"})

		if contract == 'call':
			k = 1
		else:
			k = -1

		df[f"{contract}Gamma$"] = df[f"{contract}Openinterest"] * df[f"{contract}Gamma"] * 100 * spot_price * k
		df[f"{contract}Gamma%"] = df[f"{contract}Openinterest"] * df[f"{contract}Gamma"] * 100 * (spot_price ** 2) * 0.01 * k
		df = df.reset_index()
		return df


	def get_chart_data_totals(self, calls, puts):
		df = pd.concat([calls, puts], axis=1)
		df['totalGamma$'] = df['callGamma$'] + df['putGamma$']
		df['totalGamma%'] = df['callGamma%'] + df['putGamma%']
		#df = df.reset_index()
		return df


	def get_zero_dte_data(self):
		expiry_confirm = self.confirm_front_expiration_date()
		if expiry_confirm is True:
			options = self.get_derivatives_data(data_type='options', fields=self.options_fields)
			greeks = self.get_derivatives_data(data_type='greeks', fields=self.greeks_fields)
			dataframe = pd.concat([options, greeks], axis=1)
			
			call_df = dataframe.loc[('Call', slice(None)), :]
			put_df = dataframe.loc[('Put', slice(None)), :]
			spot_price = self.get_spot_price()
			calls = self.get_chart_data(dataframe=call_df, contract='call', spot_price=spot_price)
			puts = self.get_chart_data(dataframe=put_df, contract='put', spot_price=spot_price)
			
			df = self.get_chart_data_totals(calls=calls, puts=puts)
			df = df.T.drop_duplicates().T
			
			df['strikePrice'] = pd.to_numeric(df['strikePrice'])
			start_strike = float(df['strikePrice'].iloc[0] + 50)
			end_strike = float(df['strikePrice'].iloc[-1] - 50)
			spot = spot_price.round(4)

			return df, spot, self.period

