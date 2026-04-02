"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    setInput("");
    fetchTodos();
  };

  const toggleTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>Todo App</h1>
        <p style={styles.subtitle}>Next.js 全端應用 - 部署於 Vercel</p>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="新增待辦事項..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button style={styles.addButton} onClick={addTodo}>
            新增
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>載入中...</p>
        ) : todos.length === 0 ? (
          <p style={styles.empty}>目前沒有待辦事項，新增一個吧！</p>
        ) : (
          <ul style={styles.list}>
            {todos.map((todo) => (
              <li key={todo.id} style={styles.item}>
                <span
                  style={{
                    ...styles.text,
                    textDecoration: todo.completed ? "line-through" : "none",
                    opacity: todo.completed ? 0.5 : 1,
                  }}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed ? "\u2705" : "\u2B1C"} {todo.text}
                </span>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteTodo(todo.id)}
                >
                  刪除
                </button>
              </li>
            ))}
          </ul>
        )}

        <p style={styles.footer}>
          完成 {todos.filter((t) => t.completed).length} / {todos.length} 項
        </p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "80px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  container: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "2rem",
    textAlign: "center" as const,
    marginBottom: "4px",
  },
  subtitle: {
    textAlign: "center" as const,
    color: "#888",
    marginBottom: "24px",
    fontSize: "0.9rem",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "1rem",
    outline: "none",
  },
  addButton: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  text: {
    cursor: "pointer",
    fontSize: "1rem",
    flex: 1,
  },
  deleteButton: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#ff4757",
    color: "white",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  loading: {
    textAlign: "center" as const,
    color: "#888",
    padding: "20px",
  },
  empty: {
    textAlign: "center" as const,
    color: "#aaa",
    padding: "20px",
  },
  footer: {
    textAlign: "center" as const,
    color: "#888",
    marginTop: "16px",
    fontSize: "0.85rem",
  },
};
