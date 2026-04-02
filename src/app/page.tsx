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

  const today = new Date();
  const dateStr = today.toLocaleDateString("zh-TW", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#115e59",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "56px 24px 80px 24px",
        }}
      >
        <p
          style={{
            color: "rgba(153, 246, 228, 0.7)",
            fontSize: "14px",
            marginBottom: "4px",
          }}
        >
          {dateStr}
        </p>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          我的一天
        </h1>
      </div>

      {/* White card area */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          marginTop: "-40px",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
          padding: "24px 20px 40px 20px",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Add todo input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "14px 16px",
            marginBottom: "16px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "2.5px solid #0d9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <input
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "15px",
              color: "#1e293b",
              backgroundColor: "transparent",
              minWidth: 0,
            }}
            type="text"
            placeholder="新增待辦事項"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
        </div>

        {/* Todo list */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                border: "2.5px solid #e2e8f0",
                borderTopColor: "#0d9488",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : todos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: "0 auto 16px auto", display: "block" }}
            >
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>今天沒有任務</p>
            <p style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "4px" }}>
              享受美好的一天吧
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px",
                  borderBottom:
                    index < todos.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    border: todo.completed ? "none" : "2px solid #cbd5e1",
                    backgroundColor: todo.completed ? "#0d9488" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {todo.completed && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <span
                  onClick={() => toggleTodo(todo.id)}
                  style={{
                    flex: 1,
                    fontSize: "15px",
                    color: todo.completed ? "#94a3b8" : "#334155",
                    textDecoration: todo.completed ? "line-through" : "none",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {todo.text}
                </span>

                {/* Delete */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "6px",
                    cursor: "pointer",
                    color: "#cbd5e1",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
