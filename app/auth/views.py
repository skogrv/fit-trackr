from flask import Blueprint, render_template, redirect, flash, request, url_for
from .forms import RegistrationForm, LoginForm
from flask_login import login_user, current_user, login_required, logout_user
from .models import User
from app import db, bcrypt


auth_bp = Blueprint("auth", __name__,
                    template_folder="templates",
                    static_folder="static",
                    static_url_path="/auth")


@auth_bp.route("/signup", methods=["GET", "POST"])
def signup():
    if current_user.is_authenticated:
        flash("You are already registered", "info")
        return redirect(url_for("core.home"))
    form = RegistrationForm(request.form)
    if form.validate_on_submit():
        user = User(username=form.username.data, password=form.password.data)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        flash("Registered", "success")
        return redirect(url_for("core.home"))
    return render_template("auth/signup.html", form=form, is_signup_page = True)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        flash("You are already logged in", "warning")
        return redirect(url_for("core.home"))
    form = LoginForm(request.form)
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        # if user and bcrypt.check_password_hash(user.password, request.form["password"]):
        #     login_user(user)
        #     return redirect(url_for("core.home"))
        # else:
        #     flash("Invalid username and/or password", "danger")
        #     return render_template("auth/login.html", form=form)
        login_user(user)
        return redirect(url_for("core.home"))
    return render_template("auth/login.html", form=form, is_login_page = True)


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You were logged out.", "success")
    return redirect(url_for("auth.login"))