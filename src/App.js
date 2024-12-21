import React from "react";
import { TodoProvider } from "./context/TodoProvider";
import Header from "./components/Header";
import TodoControls from "./components/TodoControls";
import TodoList from "./components/TodoList";
import styles from "./styles/app.module.css";

const App = () => {
  return (
    <TodoProvider>
      <div className={styles.container}>
        <Header />
        <TodoControls />
        <TodoList />
      </div>
    </TodoProvider>
  );
};

export default App;
