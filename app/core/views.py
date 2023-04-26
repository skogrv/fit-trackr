from flask import Blueprint, render_template, redirect
from flask_login import login_required, current_user

core_bp = Blueprint("core", __name__,
                    template_folder="templates",
                    static_folder="static")


@core_bp.route("/home")
@login_required
def home():
    return render_template("home.html")


@core_bp.route("/")
def index():
    if current_user.is_authenticated:
        return redirect("/home")
    return render_template("index.html")
