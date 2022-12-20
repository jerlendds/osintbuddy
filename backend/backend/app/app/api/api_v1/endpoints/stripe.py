import os
from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from pydantic import BaseModel
from sqlalchemy.orm import Session
import stripe

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils import send_new_account_email

router = APIRouter()

stripe_keys = {
    "secret_key": os.environ["STRIPE_SECRET_KEY"],
    "publishable_key": os.environ["STRIPE_PUBLISHABLE_KEY"],
    "price_id": os.environ["STRIPE_PRICE_ID"],
}
stripe.api_key = stripe_keys["secret_key"]


class CheckoutSession(BaseModel):
    id: str
    url: str = "http://local.host:3000/dashboard/tiktok"


@router.get("/plans")
def list_subscription_plans():
    pass

def get_checkout_session(session: CheckoutSession):
    """
    Get a stripe checkout session, https://stripe.com/docs/api/checkout/sessions

    Returns:
        _type_: _description_
    """
    try:
        checkout_session = stripe.checkout.Session.create(
            # you should get the user id here and pass it along as 'client_reference_id'
            # this will allow you to associate the Stripe session with
            # the user saved in your database
            # example: client_reference_id=user.id,
            success_url=session.url + "/?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=session.url + "/?cancel",
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": stripe_keys["price_id"],
                    "quantity": 1,
                }
            ]
        )
        return {"sessionId": checkout_session.get("id")}
    except Exception as e:
        return HTTPException(403, str(e))


@router.post("/create-checkout-session")
def create_checkout_session(
    session: CheckoutSession,
):
    return get_checkout_session(session)

@router.get("/config")
def get_publishable_key():
    stripe_config = {"publicKey": stripe_keys["publishable_key"]}
    return stripe_config
