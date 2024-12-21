import React, { useContext } from "react";
import { TodoContext } from "../context/TodoProvider";
import TodoItem from "./TodoItem";
import styles from "../styles/todoList.module.css";

const TodoList = () => {
  const { todos } = useContext(TodoContext);

  return (
    <ul className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
