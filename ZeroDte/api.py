import pandas as pd
from ninja import Router
from ninja.errors import HttpError
from . views import ZeroDteData

# Create your api's here.

router = Router()

@router.get("/get/{symbol}")
def get_zero_dte(request, symbol: str):
	if symbol == 'SPY':
		asset_type = 'etf-funds'
		quote_ticker = symbol

	if symbol == 'QQQ':
		asset_type = 'etf-funds'
		quote_ticker = symbol

	if symbol == '$SPX':
		asset_type = 'stocks'
		quote_ticker = '^GSPC'

	zero = ZeroDteData(symbol=symbol, asset_type=asset_type, quote_ticker=quote_ticker)
	try:
		market_open = zero.check_market_open()
		if market_open:
			expiry_date = zero.check_front_expiration_date()
			if expiry_date:
				try:
					df, spot, period = zero.get_zero_dte_data()
					df = df.round(4)
					data = df.to_dict(orient='index')
					return {'data': data, 'date': expiry_date, 'spot_price': spot, 'period': period}
				except Exception as error:
					print(error)
					raise HttpError(417, "Error retrieving ticker 0dte data.")
			else:
				return False
				#Here is where we would pull the saved data from db and return it
		else:
			return False
	except Exception as error:
		print(error)
		raise HttpError(417, "Error retrieving ticker 0dte data.")

