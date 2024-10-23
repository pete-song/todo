import { useState, useEffect } from "react";
import "./App.css";
import TodoTaskList from "./TodoTaskList";
import TodoTaskForm from "./TodoTaskForm";
import * as React from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("http://127.0.0.1:5000/todos");
    const data = await response.json();
    setTodos(data.todos);
    // console.log(data.todos);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTodo({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (todo) => {
    if (isModalOpen) return;
    setCurrentTodo(todo);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchTodos();
  };

  return (
    <>
      <Grid container direction="row" justifyContent="center" size={10}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          size={12}
          sx={{ mt: 4 }}
        >
          <Typography variant="h4" color="white" fontWeight={700} gutterBottom>
            Todo List
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          size={12}
          sx={{ mt: 4 }}
        >
          <TodoTaskList
            todos={todos}
            updateTodo={openEditModal}
            updateCallback={onUpdate}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          size={12}
          sx={{ mt: 4 }}
        >
          <Button variant="contained" color="success" onClick={openCreateModal}>
            Add Todo Task
          </Button>
        </Grid>
      </Grid>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TodoTaskForm existingTodo={currentTodo} updateCallback={onUpdate} />
        </Box>
      </Modal>
    </>
  );
}

export default App;
