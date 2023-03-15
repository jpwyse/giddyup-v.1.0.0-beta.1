from datetime import timedelta
from cryptography.hazmat.primitives.hashes import SHA512

# Create your config's here.

sha = SHA512()
ISO_8601 = 'iso-8601'

SETTINGS = {
    'SECURE_HASH_ALGORITHM': sha,
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'TOKEN_TTL': timedelta(hours=10),
    'TOKEN_LIMIT_PER_USER': None,
    'AUTO_REFRESH': False,
    'MIN_REFRESH_INTERVAL': 60,
    'AUTH_HEADER_PREFIX': 'Token',
    'EXPIRY_DATETIME_FORMAT': ISO_8601
}

class AuthSettings:
    def __init__(self, **entries):
        self.__dict__.update(entries)

AUTH_SETTINGS = AuthSettings(**SETTINGS)


class CONSTANTS:
    '''
    Constants cannot be changed at runtime
    '''
    TOKEN_KEY_LENGTH = 8
    DIGEST_LENGTH = 128

    def __setattr__(self, *args, **kwargs):
        raise Exception('''
            Constant values must NEVER be changed at runtime, as they are
            integral to the structure of database tables
            ''')


CONSTANTS = CONSTANTS()