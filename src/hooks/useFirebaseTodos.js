import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, push, update, remove } from "firebase/database";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const todosRef = ref(db, "todos");
    const unsubscribe = onValue(
      todosRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const todosArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTodos(todosArray);
        } else {
          setTodos([]);
        }
        setLoading(false);
      },
      () => {
        setError("Failed to load data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTodo = async (title) => {
    const todosRef = ref(db, "todos");
    await push(todosRef, { title, completed: false });
  };

  const updateTodo = (id, updatedData) => {
    const todoRef = ref(db, `todos/${id}`);
    update(todoRef, updatedData);
  };

  const deleteTodo = (id) => {
    const todoRef = ref(db, `todos/${id}`);
    remove(todoRef);
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, updateTodo, deleteTodo, loading, error }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
