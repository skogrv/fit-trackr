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
    
    
class Workout(db.Model):
    __tablename__ = "workouts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("app.auth.models.User", back_populates="workouts")

    def __repr__(self):
        return f"<name {self.name}>"
