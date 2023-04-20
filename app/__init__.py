import flask
from decouple import config
from flask import Flask
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


app = flask.Flask(__name__)

app.config.from_object(config("APP_SETTINGS"))
app.config['TEMPLATES_AUTO_RELOAD'] = True
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.login"
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)


from app.auth.models import User 


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == int(user_id)).first()

migrate = Migrate(app, db)

from app.auth.views import auth_bp
from app import views

app.register_blueprint(auth.views.auth_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
