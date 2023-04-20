from .forms import RegistrationForm
from flask import Flask, render_template, redirect, flash
from decouple import config
from . import app

app.config['SECRET_KEY'] = config("SECRET_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

# @app.route("/signup", methods=("GET", "POST"))
# def signup():
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         flash("Registered")
#         return redirect("/home")
#     return render_template("signup.html", form=form)

@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/hello/")
@app.route("/hello/<name>")
def hello_there(name=None):
    return render_template(
        "hello_there.html",
        name=name,
        date=datetime.now()
    )


@app.route("/api/data")
def get_data():
    return app.send_static_file("data.json")
