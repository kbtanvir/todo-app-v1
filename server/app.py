from flask_migrate import Migrate
from flask import Flask, jsonify
from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)


db.init_app(app)

migrate = Migrate(app, db)


@app.route("/")
def helloWorld():
    return jsonify("Hello, cross-origin-world!")


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)
