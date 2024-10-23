import logging
from flask import request, jsonify
from config import app, db
from models import Todo

@app.route("/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.all()
    json_todos = list(map(lambda x: x.to_json(), todos))
    return jsonify({"todos": json_todos})

@app.route("/create_todo", methods=["POST"])
def create_todo():
    if request.json is None:
        return jsonify({"message": "Invalid request format, expecting JSON"}), 400

    todo_task = request.json.get("todoTask")
    completed = request.json.get("completed")

    if not todo_task:
        return jsonify({"message": "You must include a todo task."}), 400

    new_todo = Todo(todo_task=todo_task, completed=completed)

    try:
        db.session.add(new_todo)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Todo task created!"}), 201

@app.route("/update_todo/<int:task_id>", methods=["PATCH"])
def update_todo(task_id):
    todo = Todo.query.get(task_id)

    if not todo:
        return jsonify({"message": "Todo task not found."}), 404

    data = request.json
    todo.todo_task = data.get("todoTask", todo.todo_task)
    todo.completed = data.get("completed", todo.completed)

    db.session.commit()

    return jsonify({"message": "Todo task updated."}), 200

@app.route("/delete_todo/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({"message": "Todo task not found"}), 404

    db.session.delete(todo)
    db.session.commit()

    return jsonify({"message": "Todo task deleted!"}), 200

@app.route("/complete_todo/<int:task_id>", methods=["PATCH"])
def complete_todo(task_id):
    todo = Todo.query.get(task_id)
    if not todo:
        return jsonify({"message": "Todo task not found."}), 404

    todo.completed = True
    db.session.commit()

    return jsonify({"message": "Todo task marked as completed."}), 200

@app.route("/completed_tasks_count", methods=["GET"])
def get_completed_tasks_count():
    completed_tasks_count = Todo.query.filter_by(completed=True).count()
    return jsonify({"completed_tasks_count": completed_tasks_count})

if __name__ == "__main__":
  # with app.app_context():
  #     db.drop_all()
  with app.app_context():
    db.create_all()

  app.run(debug=True)
