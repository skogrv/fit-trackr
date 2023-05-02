from flask import Blueprint, render_template, redirect, request, jsonify
from flask_login import login_required, current_user
from app import db
from .forms import ExerciseForm
from .models import Exercise

core_bp = Blueprint("core", __name__,
                    template_folder="templates",
                    static_folder="static",
                    static_url_path="/core")


@core_bp.route("/home")
@login_required
def home():
    exercises = Exercise.query.filter_by(
        user_id=current_user.get_id()).order_by(Exercise.id.desc()).all()
    return render_template("core/home.html", exercises=exercises)


@core_bp.route("/")
def index():
    if current_user.is_authenticated:
        return redirect("/home")
    return render_template("core/index.html")

@core_bp.route("/home/save-exercise/<exercise_name>", methods=["POST"])
@login_required
def save_exercise(exercise_name):
    form = ExerciseForm(exercise=exercise_name)

    if form.validate_on_submit():
        exercise = Exercise(name=exercise_name, user_id=current_user.get_id())
        db.session.add(exercise)
        db.session.commit()

        return jsonify({"success": True})
