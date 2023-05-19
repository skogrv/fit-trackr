from flask import Blueprint, render_template, redirect, request, jsonify, make_response
from flask_login import login_required, current_user
from app import db
from .forms import ExerciseForm, WorkoutForm
from .models import Exercise, Workout

core_bp = Blueprint("core", __name__,
                    template_folder="templates",
                    static_folder="static",
                    static_url_path="/core")


@core_bp.route("/home")
@login_required
def home():
    exercise_form = ExerciseForm()
    workout_form = WorkoutForm()
    exercises = Exercise.query.filter_by(
        user_id=current_user.get_id()).order_by(Exercise.id.desc()).all()
    workouts = Workout.query.filter_by(
        user_id=current_user.get_id()).order_by(Workout.id.desc()).all()
    return render_template("core/home.html", exercises=exercises, workouts=workouts, exercise_form=exercise_form, workout_form=workout_form)


@core_bp.route("/")
def index():
    if current_user.is_authenticated:
        return redirect("/home")
    return render_template("core/index.html")


@core_bp.route("/home/save-workout/", methods=["POST"])
@login_required
def save_workout():
    workout = request.form["workout"]
    form = WorkoutForm(workout=workout)

    if form.validate_on_submit():
        workout = Workout(name=workout, user_id=current_user.get_id())
        db.session.add(workout)
        db.session.commit()

        return(jsonify({'success': True, 'workout_name': form.workout.data}), 200)
    else:
        return jsonify({'success': False, 'errors': form.errors}), 400


@core_bp.route("/home/edit-workout/<int:workout_id>", methods=["PUT"])
@login_required
def update_workout(workout_id):
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"success": False, "message": "Exercise not found"})
    data = request.json
    new_name = data["name"]
    form = WorkoutForm(workout=new_name)
    if form.validate_on_submit():
        workout.name = new_name
        db.session.commit()
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "errors": form.errors})


@core_bp.route("/home/remove-workout/<int:workout_id>", methods=["DELETE"])
@login_required
def delete_workout(workout_id):
    workout = Workout.query.filter_by(id=workout_id).delete()
    if workout:
        db.session.commit()
        return jsonify({"success": True}), 204
    else:
        return jsonify({"success": False, "errors": "Value does not exists"}), 400


@core_bp.route("/home/save-exercise/", methods=["POST"])
@login_required
def save_exercise():
    exercise = request.form["exercise"]
    form = ExerciseForm(exercise=exercise)

    if form.validate_on_submit():
        exercise = Exercise(name=exercise, user_id=current_user.get_id())
        db.session.add(exercise)
        db.session.commit()

        return jsonify({'success': True, 'exercise_name': form.exercise.data}), 200
    else:
        return jsonify({'success': False, 'errors': form.errors}), 400


@core_bp.route("/home/edit-exercise/<int:exercise_id>", methods=["PUT"])
@login_required
def update_exercise(exercise_id):
    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({"success": False, "message": "Exercise not found"})
    data = request.json
    new_name = data["name"]
    form = ExerciseForm(exercise=new_name)
    if form.validate_on_submit():
        exercise.name = new_name
        db.session.commit()
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "errors": form.errors})


@core_bp.route("/home/remove-exercise/<int:exercise_id>", methods=["DELETE"])
@login_required
def delete_exercise(exercise_id):
    exercise = Exercise.query.filter_by(id=exercise_id).delete()
    if exercise:
        db.session.commit()
        return jsonify({"success": True}), 204
    else:
        return jsonify({"success": False, "errors": "Value does not exists"}), 400
