from hmac import compare_digest
import binascii
from os import urandom as generate_bytes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.hashes import SHA512
from django.contrib.auth.backends import BaseBackend
from django.utils import timezone
from django.core import serializers
from . models import AuthToken
from . crypto import hash_token
from . config import CONSTANTS, AUTH_SETTINGS

# Create your token auth's here. 

class TokenAuth():

    def authenticate(self, token):
        user, auth_token = self.authenticate_credentials(token=token)
        #token_inst = serializers.serialize('python', [auth_token,])
        #token = token_inst[0].get('pk')
        return user, token

    def authenticate_credentials(self, token):

        if not token:
            print("\n")
            print("No token in request header.")
            print("\n")
            return None, None

        for auth_token in AuthToken.objects.filter(
                token_key=token[:CONSTANTS.TOKEN_KEY_LENGTH]):
            if self._cleanup_token(auth_token):
                continue
            try:
                digest = hash_token(token)
            except TypeError as error:
                print("\n")
                print(f"Error with hash token: {error}")
                print("\n")
                return None, None
            if compare_digest(digest, auth_token.digest):
                if AUTH_SETTINGS.AUTO_REFRESH and auth_token.expiry:
                    self.renew_token(auth_token)
                return self.validate_user(auth_token)
            else:
                print("\n")
                print("Token Digest equivalency false.")
                print("\n")
                return None, None
               
                
        print("\n")
        print("Invalid token.")
        print("\n")
        return None, None

    def renew_token(self, auth_token):
        current_expiry = auth_token.expiry
        new_expiry = timezone.now() + AUTH_SETTINGS.TOKEN_TTL
        auth_token.expiry = new_expiry
        # Throttle refreshing of token to avoid db writes
        delta = (new_expiry - current_expiry).total_seconds()
        if delta > AUTH_SETTINGS.MIN_REFRESH_INTERVAL:
            auth_token.save(update_fields=('expiry',))

    def validate_user(self, auth_token):
        if not auth_token.user.is_active:
            print("\n")
            print("User not registered.")
            print("\n")
            return None, None
        return (auth_token.user, auth_token)

    def _cleanup_token(self, auth_token):
        for other_token in auth_token.user.user_tokens.all():
            if other_token.digest != auth_token.digest and other_token.expiry:
                if other_token.expiry < timezone.now():
                    other_token.delete()
                    username = other_token.user.get_username()

        if auth_token.expiry is not None:
            if auth_token.expiry < timezone.now():
                username = auth_token.user.get_username()
                auth_token.delete()
                return True
        return False


