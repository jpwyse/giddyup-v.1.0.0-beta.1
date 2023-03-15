from ninja import NinjaAPI
from Users.api import router as auth_router
from ZeroDte.api import router as zero_dte_router

# Create your router's here.

api = NinjaAPI()

api.add_router("/auth/", auth_router)
api.add_router("/zero_dte/", zero_dte_router)


