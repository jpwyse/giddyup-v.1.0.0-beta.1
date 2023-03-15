import binascii
from os import urandom as generate_bytes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.hashes import SHA512
from . config import AUTH_SETTINGS

# Create your cryptography here.

sha = AUTH_SETTINGS.SECURE_HASH_ALGORITHM

def create_token_string():
    return binascii.hexlify(
        generate_bytes(int(AUTH_SETTINGS.AUTH_TOKEN_CHARACTER_LENGTH / 2))
    ).decode()


def hash_token(token):
    digest = hashes.Hash(sha, backend=default_backend())
    digest.update(binascii.unhexlify(token))
    return binascii.hexlify(digest.finalize()).decode()


