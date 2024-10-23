import * as React from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";

const TodoTaskList = ({ todos, updateTodo, updateCallback }) => {
  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        `http://127.0.0.1:5000/delete_todo/${id}`,
        options,
      );
      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to delete.");
      }
    } catch (error) {
      alert(error);
    }
  };

  const onComplete = async (id) => {
    try {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      };
      const response = await fetch(
        `http://127.0.0.1:5000/complete_todo/${id}`,
        options,
      );
      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to mark as completed.");
      }
    } catch (error) {
      alert(error);
    }
  };

  const columns = [
    { field: "todoTask", headerName: "Todo Task", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateTodo(params.row)}
            >
              Update
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onDelete(params.row.id)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                onComplete(params.row.id);
                onDelete(params.row.id);
              }}
            >
              Done
            </Button>
          </Grid>
        </Grid>
      ),
      flex: 1,
    },
  ];

  return (
    <Grid size={10}>
      <Paper style={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={todos}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Paper>
    </Grid>
  );
};

TodoTaskList.propTypes = {
  todos: PropTypes.object,
  updateTodo: PropTypes.func,
  updateCallback: PropTypes.func,
};

export default TodoTaskList;
