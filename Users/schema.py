from datetime import date
from typing import List
from ninja import Router, Schema, ModelSchema, Field, Form
from ninja.orm import create_schema

# Create your schemas's here.

class SignUpSchema(Schema):
	firstname: str
	lastname: str
	email: str
	username: str
	dob: date = None
	password: str


class LoginSchema(Schema):
	username: str
	password: str


class UserSchema(Schema):
	id: int = None
	first_name: str = None
	last_name: str = None
	email: str = None
	username: str = None
	dob: date = None
	date_joined: date = None
	

class UserAuthSchema(Schema):
	token_key: str
	user: UserSchema


class EditProfileSchema(Schema):
	first_name: str = None
	last_name: str = None
	email: str = None
	username: str = None
	dob: str = None


class ChangePasswordSchema(Schema):
	oldpassword: str
	newpassword: str

