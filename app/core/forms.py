from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators
from wtforms.validators import DataRequired, Length, EqualTo


class ExerciseForm(FlaskForm):
    exercise = StringField('Exercise', validators=[DataRequired(),
        validators.Regexp(r'^[a-zA-Z ]*$', message="Exercise name must contain only letters and spaces.")
    ])

    def validate(self, extra_validators=None):
        initial_validation = super(ExerciseForm, self).validate()
        if not initial_validation:
            return False
        return True
    
class WorkoutForm(FlaskForm):
    workout = StringField('Workout', validators=[DataRequired(),
        validators.Regexp(r'^[a-zA-Z ]*$', message="Exercise name must contain only letters and spaces.")
    ])

    def validate(self, extra_validators=None):
        initial_validation = super(WorkoutForm, self).validate()
        if not initial_validation:
            return False
        return True
