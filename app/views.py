from .forms import RegistrationForm
from flask import Flask, render_template, redirect, flash
from decouple import config
from . import app

app.config['SECRET_KEY'] = config("SECRET_KEY")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/home")
def home():
    return render_template("index.html")

