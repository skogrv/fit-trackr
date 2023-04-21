from flask import Blueprint, render_template
from flask_login import login_required

core_bp = Blueprint("core", __name__)


@core_bp.route("/home")
@login_required
def home():
    return render_template("index.html")


@core_bp.route("/")
def index():
    return render_template("index.html")