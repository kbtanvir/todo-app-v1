from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask import Flask, jsonify, request
from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

# SQLAlchemy config
# ---------------------

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
ma = Marshmallow(app)


# MODEL config
# ---------------------

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)


# * JSON serialization
# ---------------------

class TodoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Todo


todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

db.init_app(app)  # implements sqlite db file

migrate = Migrate(app, db)  # implements migration files


# API routes configuration
# ---------------------

@app.route("/")
def helloWorld():
    return jsonify("Hello, cross-origin-world!")


@app.route('/todos', methods=['GET'])
def get_todos():
    data = Todo.query.all()

    result = todos_schema.dump(data)

    return jsonify(result)


@app.route('/todos', methods=['POST'])
def add_todo():
    title = request.json['title']
    description = request.json['description']
    completed = request.json['completed']

    new_todo = Todo(title=title, description=description, complete=completed)

    db.session.add(new_todo)
    db.session.commit()

    return todo_schema.jsonify(new_todo)


@app.route('/todos/<id>', methods=['GET'])
def get_todo(id):
    todo = Todo.query.get(id)
    return todo_schema.jsonify(todo)


@app.route('/todos/<id>', methods=['PUT'])
def update_todo(id):
    todo = Todo.query.get(id)

    title = request.json['title']
    description = request.json['description']
    completed = request.json['completed']

    todo.title = title
    todo.description = description
    todo.completed = completed

    db.session.commit()

    return todo_schema.jsonify(todo)


@app.route('/todos/<id>', methods=['DELETE'])
def delete_todo(id):
    todo = Todo.query.get(id)
    db.session.delete(todo)
    db.session.commit()

    return todo_schema.jsonify(todo)


if __name__ == '__main__':

    with app.app_context():  # must run flask app inside app context to ensure sql alchemy is working properly
        db.create_all()
        app.run(debug=True)
