import flask 
app = flask.Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
from app import views

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

