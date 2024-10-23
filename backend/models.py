from config import db

class Todo(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  todo_task = db.Column(db.String(255), unique=False, nullable=False)
  completed = db.Column(db.Boolean, default=False)

  def to_json(self):
    return {
      "id": self.id,
      "todoTask": self.todo_task,
      "completed": self.completed,
    }
