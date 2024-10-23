import { useState } from "react";
import { FormLabel, TextField, Button, Box } from "@mui/material";
import PropTypes from "prop-types";

const TodoTaskForm = ({ existingTodo = {}, updateCallback }) => {
  const [todoTask, setTodoTask] = useState(existingTodo.todoTask || "");

  const updating = Object.entries(existingTodo).length !== 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!todoTask.trim()) {
      alert("Todo task cannot be empty!");
      return;
    }

    const data = {
      todoTask,
    };

    const url =
      updating && existingTodo.id
        ? `http://127.0.0.1:5000/update_todo/${existingTodo.id}`
        : "http://127.0.0.1:5000/create_todo";

    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);
      console.log("response", response);

      if (response.status !== 201 && response.status !== 200) {
        const responseData = await response.json();
        alert(responseData.message);
      } else {
        updateCallback();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Box mb={2}>
        <FormLabel htmlFor="todoTask">Create a todo task</FormLabel>
        <TextField
          fullWidth
          id="todoTask"
          variant="outlined"
          value={todoTask}
          onChange={(e) => setTodoTask(e.target.value)}
          margin="normal"
          placeholder="Write a task here!"
        />
      </Box>
      <Button type="submit" variant="contained" color="primary">
        {updating ? "Update" : "Create"}
      </Button>
    </form>
  );
};

TodoTaskForm.propTypes = {
  existingTodo: PropTypes.object,
  updateCallback: PropTypes.func,
};

export default TodoTaskForm;
