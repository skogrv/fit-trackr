import flask 
from decouple import config
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


app = flask.Flask(__name__)
from app import views
from .auth import routes
app.register_blueprint(auth.routes.auth_bp)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config.from_object(config("APP_SETTINGS"))
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

