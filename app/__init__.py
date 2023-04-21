from decouple import config
from flask import Flask
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


app = flask.Flask(__name__)

app.config.from_object(config("APP_SETTINGS"))
app.config['SECRET_KEY'] = config("SECRET_KEY")
app.config['TEMPLATES_AUTO_RELOAD'] = True

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.login"
login_manager.login_message_category = "danger"

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)


from app.auth.models import User 


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == int(user_id)).first()


from app.auth.views import auth_bp
from app.core.views import core_bp


app.register_blueprint(auth_bp)
app.register_blueprint(core_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
