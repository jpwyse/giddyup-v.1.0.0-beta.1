import traceback
from typing import List
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError, transaction
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from ninja import Router, Schema, ModelSchema, Field, Form
from ninja.security import HttpBearer, APIKeyHeader
from ninja.errors import HttpError
from ninja.responses import Response
from ninja.orm import create_schema
from . models import User, AuthToken
from . schema import SignUpSchema, LoginSchema, UserSchema, UserAuthSchema, EditProfileSchema, ChangePasswordSchema
from . token import TokenAuth
from . config import CONSTANTS, AUTH_SETTINGS
from . crypto import hash_token

# Create your api's here.

router = Router()

# SIGNUP
@router.post("/signup")
def signup(request, form: SignUpSchema):
	with transaction.atomic():
		try:
			user = User.objects.create_user(form.username, form.email, form.password)
		except IntegrityError:
			raise HttpError(409, "User already registered.")
		except Exception as error:
			print(error)
			raise HttpError(422, f"{error}")
		else:
			if user and user.is_authenticated:
				user.first_name = form.firstname.capitalize()
				user.last_name = form.lastname.capitalize()
				user.dob = form.dob
				user.save()
				_, token = AuthToken.objects.create(user)
				return 200, UserAuthSchema(user=user, token_key=token)
			raise HttpError(405, "User registration not permitted or failed.")


# LOGIN
@router.post("/login", response=UserAuthSchema)
def login(request, login: LoginSchema):
	user = authenticate(request, username=login.username, password=login.password)
	if user and user.is_authenticated:
		_, token = AuthToken.objects.create(user)
		return 200, UserAuthSchema(user=user, token_key=token)
	raise HttpError(401, "Incorrect login credentials.")


# AUTHENTICATE
@router.get("/user_auth")
def user_auth(request):
	if 'Authorization' in request.headers:
		auth_header = request.headers.get('Authorization')
		token = auth_header.split()[1]
		try:
			user, token = TokenAuth().authenticate(token=token)
			return 200, UserAuthSchema(user=user, token_key=token)
		except Exception as error:
			raise HttpError(403, "User is not authenticated.")
	else:
		print("Authorization not in headers.")
		raise HttpError(401, "User is not authenticated.")


# LOGOUT
@router.get("/logout")
def logout(request):
	if 'Authorization' in request.headers:
		auth_header = request.headers.get('Authorization')
		token = auth_header.split()[1]
		try:
			AuthToken.objects.filter(token_key=token[:CONSTANTS.TOKEN_KEY_LENGTH]).delete()
		except Exception as error:
			raise HttpError(405, f"{error}")
		else:
			return Response("User has been logged out.", status=205)
	else:
		print("Authorization not in headers.")
		raise HttpError(412, "Authorization token not in headers.")



# EDIT PROFILE 
@router.post("/edit_profile/{user_id}")
def edit_profile(request, user_id: int, form: EditProfileSchema):
	form_data = form.dict()
	clean_form = {key: value for key, value in form_data.items() if value is not None}
	try:
		user = User.objects.get(pk=user_id)
		if user and user.is_authenticated:
			try:
				User.objects.update(**clean_form)

				admin_email = settings.EMAIL_HOST_USER
				template = 'emails/updated_profile.html'
				context = {'username': user.get_username(), 'admin_email': admin_email}
				html_message = render_to_string(template, context)

				message = EmailMessage(
					subject="Profile Updated",
					body=html_message,
					from_email=admin_email,
					to=[user.email],
					reply_to=[admin_email],
				)
				message.content_subtype = 'html'
				message.send()

				return Response("User profile has been updated.", status=202)
			except Exception as error:
				print(error)
				raise HttpError(406, "Unable to update user profile at this time.")
		else:
			raise HttpError(406, "Unable to update user profile at this time. User is not authenticated or does not exist.")
	except Exception as error:
		print(error)
		raise HttpError(403, "User does not exist.")



# CHANGE PASSWORD 
@router.post("/change_password/{user_username}")
def change_password(request, user_username: str, form: ChangePasswordSchema):
	user = authenticate(username=user_username, password=form.oldpassword)
	if user and user.is_authenticated:
		try:
			user.set_password(form.newpassword)
			user.save()

			admin_email = settings.EMAIL_HOST_USER
			template = 'emails/password_change.html'
			context = {'username': user.get_username(), 'admin_email': admin_email}
			html_message = render_to_string(template, context)

			message = EmailMessage(
				subject="Password Reset",
				body=html_message,
				from_email=admin_email,
				to=[user.email],
				reply_to=[admin_email],
			)
			message.content_subtype = 'html'
			message.send()

			return Response("User password has been successfully changed.", status=202)
		except Exception as error:
			print(error)
			raise HttpError(405, "Unable to change user password at this time.")
	else:
		raise HttpError(401, "Incorrect password.")


# DELETE ACCOUNT
@router.get("/delete_account/{user_id}")
def delete_account(request, user_id: int):
	try:
		user = User.objects.get(pk=user_id)
		if user and user.is_authenticated:
			user.delete()

			admin_email = settings.EMAIL_HOST_USER
			template = 'emails/account_delete.html'
			context = {'username': user.get_username(), 'admin_email': admin_email}
			html_message = render_to_string(template, context)

			message = EmailMessage(
				subject="Account Deleted",
				body=html_message,
				from_email=admin_email,
				to=[user.email],
				reply_to=[admin_email],
			)
			message.content_subtype = 'html'
			message.send()

			return Response("User account has been deleted.", status=202)
		else:
			raise HttpError(401, "User is not authenticated.")
	except Exception as error:
		print(error)
		raise HttpError(406, "Unable to delete user account at this time.")



# CHECK UNIQUE USER 
@router.get("/unique/{value}")
def unique_user(request, value: str):
	form_value = list(value)

	if "@" in form_value:
		try:
			user = User.objects.get(email=value)
		except User.DoesNotExist:
			return {"success": True}
		else:
			return False
	else:
		try:
			user = User.objects.get(username=value)
		except User.DoesNotExist:
			return True
		else:
			return False


