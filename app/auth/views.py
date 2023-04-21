from flask import Blueprint, render_template, redirect, flash, request, url_for
from .forms import RegistrationForm, LoginForm
from flask_login import login_user, current_user
from .models import User
from app import db, bcrypt


auth_bp = Blueprint("auth_bp", __name__,
                    template_folder="templates",
                    static_folder="static")

@auth_bp.route("/signup", methods=("GET", "POST"))
def signup():
    if current_user.is_authenticated:
        flash("You are already registered")
        return redirect(url_for("core.home"))
    form = RegistrationForm(request.form)
    if form.validate_on_submit():
        flash("Registered")
        return redirect("/home")
    return render_template("signup.html", form=form)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        flash("You are already logged in")
        return redirect(url_for("core.home"))
    form = LoginForm(request.form)
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and bcrypt.check_password_hash(user.password, request.form["password"]):
           login_user(user) 
           return redirect(url_for("core.home"))
        else:
            flash("Invalid username and/or password")
            return render_template("login.html", form=form)
    return render_template("login.html", form=form)