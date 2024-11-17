import { useEffect, useState, useCallback } from "react";
import styles from "./app.module.css";
import { db } from "./firebase";
import { ref, onValue, push, update, remove } from "firebase/database";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortByAlphabet, setSortByAlphabet] = useState(false);

  // Загрузка данных из Firebase
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
      (error) => {
        setError("Ошибка загрузки данных");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Отписываемся от событий при размонтировании
  }, []);

  const handleSearch = useCallback(
    debounce((query) => {
      const filtered = todos.filter((todo) =>
        todo.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTodos(filtered);
    }, 500),
    [todos]
  );

  const onSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const toggleSort = () => {
    setSortByAlphabet(!sortByAlphabet);
    if (!sortByAlphabet) {
      setFilteredTodos((prevTodos) =>
        [...prevTodos].sort((a, b) => a.title.localeCompare(b.title))
      );
    } else {
      setFilteredTodos(todos);
    }
  };

  const addTodo = (title) => {
    const todosRef = ref(db, "todos");
    push(todosRef, { title, completed: false });
  };

  const updateTodo = (id, updatedData) => {
    const todoRef = ref(db, `todos/${id}`);
    update(todoRef, updatedData);
  };

  const deleteTodo = (id) => {
    const todoRef = ref(db, `todos/${id}`);
    remove(todoRef);
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
        {sortByAlphabet ? "Отключить сортировку" : "Сортировать по алфавиту"}
      </button>

      {/* Добавление новой задачи */}
      <button
        onClick={() => addTodo(prompt("Введите название задачи"))}
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
