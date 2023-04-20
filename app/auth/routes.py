from flask import Blueprint, render_template, redirect, flash
from app.forms import RegistrationForm


auth_bp = Blueprint("auth_bp", __name__,
                    template_folder="templates",
                    static_folder="static")

@auth_bp.route("/signup", methods=("GET", "POST"))
def signup():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash("Registered")
        return redirect("/home")
    return render_template("signup.html", form=form)


@auth_bp.route("/login")
def login():
    return render_template("login.html")