import React, { useState, useContext } from "react";
import { TodoContext } from "../context/TodoProvider";
import styles from "../styles/controls.module.css";

const TodoControls = () => {
  const { addTodo } = useContext(TodoContext);
  const [inputValue, setInputValue] = useState("");

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className={styles.controls}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={handleAddTodo}>Add</button>
    </div>
  );
};

export default TodoControls;
