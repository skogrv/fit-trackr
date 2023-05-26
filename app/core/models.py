from flask_login import UserMixin
from app import bcrypt, db


class Exercise(db.Model):
    __tablename__ = "exercises"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("app.auth.models.User", back_populates="exercises")

    def __repr__(self):
        return f"<name {self.name}>"
    
    def __str__(self):
        return self.name

workout_exercises = db.Table(
    "workout_exercises", 
    db.Column("workout_id", db.Integer, db.ForeignKey("workouts.id"), primary_key=True),
    db.Column("exercise_id", db.Integer, db.ForeignKey("exercises.id"), primary_key=True)
)

class Workout(db.Model):
    __tablename__ = "workouts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    exercise_ids = db.relationship(
        "Exercise", secondary=workout_exercises, backref=db.backref("workouts", lazy="dynamic"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("app.auth.models.User", back_populates="workouts")

    def __repr__(self):
        return f"<name {self.name}>"
