export const getTodosFromStorage = () => {
  const storedTodos = localStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : [];
};

export const saveTodosToStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
