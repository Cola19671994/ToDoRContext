import React, { useContext } from "react";
import { TodoContext } from "../context/TodoProvider";

const TodoItem = ({ todo }) => {
  const { deleteTodo, toggleTodo } = useContext(TodoContext);

  return (
    <li>
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
        }}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.title}
      </span>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
};

export default TodoItem;
