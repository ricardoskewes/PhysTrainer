from pt_Firebase import authentication, auth

class pt_User(auth.UserRecord):
    @classmethod
    def read(cls, uid: str):
        user = authentication.get_user(uid=uid)
        user.__class__ = cls
        return user

    def __init__(self, data: dict) -> None:
        super().__init__(self)
        self.uid = data.get("uid", None)
        self.email = data.get("email", None)
        self.email_verified = data.get("email_verified", False)
        self.display_name = data.get("display_name", "None")
        self.disabled = data.get("disabled", False)
        self.phone_number = data.get("phone_number", "None")
        self.photo_url = data.get("photo_url", "")
        self.user_metadata = data.get("user_metadata", "")

    def to_dict(self):
        return {
            "uid": self.uid, 
            "email": self.email, 
            "email_verified": self.email_verified, 
            "display_name": self.display_name, 
            "disabled": self.disabled, 
            "phone_number": self.phone_number, 
            "photo_url": self.photo_url, 
            "user_metadata": self.user_metadata
        }

    def get_additional_info(self):
        # Read additional info from firebase
        pass