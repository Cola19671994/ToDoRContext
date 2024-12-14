import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import styles from "./app.module.css";
import { db } from "./firebase";
import { ref, onValue, push, update, remove } from "firebase/database";

const TodoContext = createContext();

const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortByAlphabet, setSortByAlphabet] = useState(false);

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
          setFilteredTodos(todosArray);
        } else {
          setTodos([]);
          setFilteredTodos([]);
        }
        setLoading(false);
      },
      () => {
        setError("Ошибка загрузки данных");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTodo = async (title) => {
    try {
      const todosRef = ref(db, "todos");
      await push(todosRef, { title, completed: false });
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
      alert("Не удалось добавить задачу");
    }
  };

  const updateTodo = async (id, updatedData) => {
    try {
      const todoRef = ref(db, `todos/${id}`);
      await update(todoRef, updatedData);
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      alert("Не удалось обновить задачу");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todoRef = ref(db, `todos/${id}`);
      await remove(todoRef);
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      alert("Не удалось удалить задачу");
    }
  };

  const toggleSort = () => {
    setSortByAlphabet((prev) => !prev);
    setFilteredTodos((prevTodos) => {
      const sortedTodos = [...prevTodos].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      return sortByAlphabet ? todos : sortedTodos;
    });
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        searchQuery,
        setSearchQuery,
        loading,
        error,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleSort,
        setFilteredTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

const useTodos = () => useContext(TodoContext);

export const App = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

const TodoApp = () => {
  const {
    filteredTodos,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleSort,
  } = useTodos();

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((query, todos, setFilteredTodos) => {
      setFilteredTodos(
        todos.filter((todo) =>
          todo.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 500),
    []
  );

  const onSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, filteredTodos, setFilteredTodos);
  };

  if (loading) {
    return <div className={styles.app}>Загрузка списка задач...</div>;
  }

  if (error) {
    return <div className={styles.app}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.app}>
      <h1>Task List</h1>

      {/* Поле поиска */}
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Поиск задач..."
        className={styles.searchInput}
      />

      {/* Кнопка сортировки */}
      <button onClick={toggleSort} className={styles.sortButton}>
        Сортировать
      </button>

      {/* Добавление новой задачи */}
      <button
        onClick={() => {
          const title = prompt("Введите название задачи");
          if (title) addTodo(title);
        }}
        className={styles.addButton}
      >
        Добавить задачу
      </button>

      {/* Список задач */}
      <div>
        {filteredTodos.length === 0 ? (
          <p>Ничего не найдено</p>
        ) : (
          filteredTodos.map(({ id, title, completed }) => (
            <div
              key={id}
              className={`${styles.todoItem} ${
                completed ? styles.completed : ""
              }`}
            >
              <input
                type="checkbox"
                checked={completed}
                onChange={() => updateTodo(id, { completed: !completed })}
              />
              {title}
              <button
                onClick={() => deleteTodo(id)}
                className={styles.deleteButton}
              >
                Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
