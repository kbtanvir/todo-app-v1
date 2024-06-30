from flask_marshmallow import Marshmallow
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
ma = Marshmallow(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)


class TodoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Todo


todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

db.init_app(app)

migrate = Migrate(app, db)


@app.route("/")
def helloWorld():
    return jsonify("Hello, cross-origin-world!")


@app.route('/todos', methods=['GET'])
def get_todos():
    data = Todo.query.all()

    result = todos_schema.dump(data)

    return jsonify(result)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)
