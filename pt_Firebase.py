from functools import wraps
import json
import os
from flask import abort, redirect, request, session
import requests
import firebase_admin
from firebase_admin import firestore, credentials, auth, storage
from sympy import use

# Use the application default credentials
app = firebase_admin.initialize_app(credentials.Certificate({**json.loads(os.environ['FIREBASE_KEY'])}), {
  'projectId': "physolympiadtrainer",
  'storageBucket': 'physolympiadtrainer.appspot.com'
})


class ExtendedAuthClient(auth.Client):
  def __init__(self, app, tenant_id=None):
    super().__init__(app, tenant_id)
  
  # https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
  def sign_in_with_email_and_password(self, email: str, password: str) -> str:
    req = requests.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAt21y6iMy45pQ814LMy93hlYmqSKCn4Lo", data={
      "email": email, 
      "password": password, 
      "returnSecureToken": True
    })
    return req.json()["idToken"]
  
  def get_user_by_id_token(self, id_token: str):
    token = self.verify_id_token(id_token)
    user = self.get_user(token["uid"])
    return user

  # https://firebase.google.com/docs/reference/rest/auth#section-send-password-reset-email
  def email_password_reset_link(self, email: str):
    req = requests.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAt21y6iMy45pQ814LMy93hlYmqSKCn4Lo", data={
      "email": email,
      "requestType": "PASSWORD_RESET"
    })
    return req.json()["email"]

  def login_required_decorator(self, f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      user = None
      try:
        token = session.get("current_id_token")
        print("Token exists {0}".format(token is not None))
        user = self.get_user_by_id_token(token)
      except Exception as e:
        print(e)
        return abort(401)
      return f(user, *args, **kwargs)
    return decorated_function

  def login_optional_decorator(self, f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      user = None
      try:
        token = session.get("current_id_token")
        print("Token exists {0}".format(token is not None))
        user = self.get_user_by_id_token(token)
      except Exception as e:
        user = None
      return f(user, *args, **kwargs)
    return decorated_function

  def login_required_template_decorator(self, f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      user = None
      try: 
        token = session.get("current_id_token")
        print("Token exists {0}".format(token is not None))
        user = self.get_user_by_id_token(token)
      except Exception as e:
        return redirect("/login?redirect="+request.url)
      return f(user, *args, **kwargs)
    return decorated_function


# Exports
database = firestore.client()
authentication = ExtendedAuthClient(app)
bucket = storage.bucket()