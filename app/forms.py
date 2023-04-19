from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Length, EqualTo


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(),
                                                   Length(min=5, max=20)])
    password = PasswordField('New Password', validators=[InputRequired(),
                                                         Length(min=7, max=20),
                                                         EqualTo('confirm', message='Passwords must match'
                                                                 )])
    confirm = PasswordField('Repeat Password')
