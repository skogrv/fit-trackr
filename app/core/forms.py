from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Length, EqualTo


class ExerciseForm(FlaskForm):
    exercise = StringField('Exercise', validators=[DataRequired()])

    def validate(self, extra_validators=None):
        initial_validation = super(ExerciseForm, self).validate()
        if not initial_validation:
            return False
        return True
