from datetime import datetime
from flask_login import UserMixin
from app import bcrypt, db


class User(UserMixin, db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    created_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = bcrypt.generate_password_hash(password)
        self.created_on = datetime.now()

    def __repr__(self):
        return f"<username {self.username}>"