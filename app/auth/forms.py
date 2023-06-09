from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, EqualTo
from .models import User
from app import bcrypt



class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(),
                                                   Length(min=5, max=20)])
    password = PasswordField('New Password', validators=[DataRequired(),
                                                         Length(min=7, max=20),
                                                         ])
    confirm = PasswordField('Repeat Password', validators=[
                            DataRequired(), EqualTo('password', message='Passwords must match'
                                                                 )])
    submit = SubmitField()
    remember_me = BooleanField("Remember me")

    def validate(self, extra_validators=None):
        initial_validation = super(RegistrationForm, self).validate()
        if not initial_validation:
            return False
        user = User.query.filter_by(username=self.username.data).first()
        if user:
            self.username.errors.append("Username is already taken")
            return False
        return True


class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Log in")
    remember_me = BooleanField("Remember me")

    def validate(self, extra_validators=None):
        initial_validation = super(LoginForm, self).validate()
        if not initial_validation:
            return False 
        user = User.query.filter_by(username=self.username.data).first()
        if not user:
            self.username.errors.append("Username is not found")
            return False
        if user and not bcrypt.check_password_hash(user.password, self.password.data):
            self.password.errors.append("Password is incorrect")
            return False
        return True