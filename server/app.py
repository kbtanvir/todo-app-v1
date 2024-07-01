from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask import Flask, jsonify, request
from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger

app = Flask(__name__)

# SQLAlchemy config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
ma = Marshmallow(app)
swagger = Swagger(app)

# Model


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

# JSON serialization


class TodoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Todo


todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

db.init_app(app)
migrate = Migrate(app, db)

# API routes configuration


@app.route("/")
def helloWorld():
    """
    Default endpoint to greet the world.
    ---
    responses:
      200:
        description: A greeting message
    """
    return jsonify("Hello, cross-origin-world!")


@app.route('/todos', methods=['GET'])
def get_todos():
    """
    Get all todos
    ---
    tags:
      - Todos
    responses:
      200:
        description: List of todo items
        schema:
          type: array
          items:
            $ref: '#/definitions/Todo'
    definitions:
      Todo:
        type: object
        properties:
          id:
            type: integer
          title:
            type: string
          description:
            type: string
          completed:
            type: boolean
    """
    data = Todo.query.all()
    result = todos_schema.dump(data)
    return jsonify(result)


@app.route('/todos', methods=['POST'])
def add_todo():
    """
    Add a new todo
    ---
    tags:
      - Todos
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - title
            - description
            - completed
          properties:
            title:
              type: string
              example: "New Todo"
            description:
              type: string
              example: "Description of the new todo"
            completed:
              type: boolean
              example: false
    responses:
      200:
        description: Todo item added
        schema:
          id: Todo
          properties:
            id:
              type: integer
            title:
              type: string
            description:
              type: string
            completed:
              type: boolean
    """
    try:
        title = request.json.get('title')
        description = request.json.get('description')
        completed = request.json.get('completed')

        if title is None or description is None or completed is None:
            return jsonify({'error': 'Missing required fields'}), 400

        new_todo = Todo(title=title, description=description, completed=completed)
        db.session.add(new_todo)
        db.session.commit()

        return todo_schema.jsonify(new_todo), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/todos/<int:id>', methods=['GET'])
def get_todo(id):
    """
    Get one by ID
    ---
    tags:
      - Todos
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: The ID of the todo item
    responses:
      200:
        description: A single todo item
        schema:
          $ref: '#/definitions/Todo'
      404:
        description: Todo not found
    """
    todo = Todo.query.get(id)
    if todo:
        return todo_schema.jsonify(todo), 200
    else:
        return jsonify({'error': 'Todo not found'}), 404


@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    """
    Update a todo by ID
    ---
    tags:
      - Todos
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: The ID of the todo item
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - title
            - description
            - completed
          properties:
            title:
              type: string
              example: "Updated Todo"
            description:
              type: string
              example: "Updated description"
            completed:
              type: boolean
              example: true
    responses:
      200:
        description: Todo item updated
        schema:
          $ref: '#/definitions/Todo'
      404:
        description: Todo not found
    """
    try:
        todo = Todo.query.get(id)
        if todo:
            title = request.json.get('title')
            description = request.json.get('description')
            completed = request.json.get('completed')

            if title is None or description is None or completed is None:
                return jsonify({'error': 'Missing required fields'}), 400

            todo.title = title
            todo.description = description
            todo.completed = completed

            db.session.commit()

            return todo_schema.jsonify(todo), 200
        else:
            return jsonify({'error': 'Todo not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    """
    Delete a todo by ID
    ---
    tags:
      - Todos
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: The ID of the todo item
    responses:
      200:
        description: Todo item deleted
        schema:
          $ref: '#/definitions/Todo'
      404:
        description: Todo not found
    """
    try:
        todo = Todo.query.get(id)
        if todo:
            db.session.delete(todo)
            db.session.commit()
            return todo_schema.jsonify(todo), 200
        else:
            return jsonify({'error': 'Todo not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    with app.app_context():
        cors = CORS(app)
        db.create_all()
        app.run(host='0.0.0.0', port=5000, debug=True)
