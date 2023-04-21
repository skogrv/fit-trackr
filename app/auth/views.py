from flask import Blueprint, render_template, redirect, flash, request
from .forms import RegistrationForm
from flask_login import login_user, current_user
from .models import User
from app import db


auth_bp = Blueprint("auth_bp", __name__,
                    template_folder="templates",
                    static_folder="static")

@auth_bp.route("/signup", methods=("GET", "POST"))
def signup():
    if current_user.is_authenticated:
        flash("You are already registered")
        return redirect(url_for("core_bp.home"))
    form = RegistrationForm(request.form)
    if form.validate_on_submit():
        flash("Registered")
        return redirect("/home")
    return render_template("signup.html", form=form)


@auth_bp.route("/login")
def login():
    return render_template("login.html")