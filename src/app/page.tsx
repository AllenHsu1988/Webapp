"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  starred: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch todos");
        setLoading(false);
        return;
      }
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
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

  const toggleStar = async (id: number) => {
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, field: "starred" }),
    });
    fetchTodos();
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-blue-400 flex flex-col">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-4 pt-12 pb-1">
        <button className="text-white text-base font-medium flex items-center gap-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Lists
        </button>
        <div className="flex items-center gap-5">
          <button className="text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v-2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </button>
          <button className="text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </nav>

      {/* List title */}
      <h1 className="text-white text-3xl font-bold px-5 pt-2 pb-4">my list</h1>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 pb-28">
        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center pt-20 gap-3">
            <p className="text-white/80 text-base text-center px-4">{error}</p>
            <button
              className="text-white underline text-sm"
              onClick={() => { setLoading(true); setError(null); fetchTodos(); }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Active todos */}
            {activeTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-xl shadow-sm mb-2 flex items-center px-4 py-3.5"
              >
                <button
                  className="shrink-0 w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center"
                  onClick={() => toggleTodo(todo.id)}
                />
                <span
                  className="flex-1 text-gray-800 text-base ml-3 cursor-pointer select-none"
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>
                <button
                  className={`shrink-0 ml-2 ${todo.starred ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => toggleStar(todo.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={todo.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Completed section */}
            {completedTodos.length > 0 && (
              <>
                <button
                  className="flex items-center gap-2 text-white text-sm font-semibold mt-4 mb-2 px-1"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${showCompleted ? "rotate-0" : "-rotate-90"}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Completed
                </button>

                {showCompleted &&
                  completedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="bg-white rounded-xl shadow-sm mb-2 flex items-center px-4 py-3.5"
                    >
                      <button
                        className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                        onClick={() => toggleTodo(todo.id)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <span
                        className="flex-1 text-gray-400 text-base ml-3 line-through cursor-pointer select-none"
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.text}
                      </span>
                      <button
                        className={`shrink-0 ml-2 ${todo.starred ? "text-yellow-400" : "text-gray-300"}`}
                        onClick={() => toggleStar(todo.id)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={todo.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </>
            )}

            {/* Empty state */}
            {todos.length === 0 && (
              <div className="flex items-center justify-center pt-20">
                <p className="text-white/60 text-lg">No tasks yet</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Fixed bottom "Add a Task" bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-indigo-500/70 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3 bg-white/25 rounded-xl px-4 py-3.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <input
            className="flex-1 bg-transparent text-white placeholder-white/70 outline-none text-base"
            type="text"
            placeholder="Add a Task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
        </div>
      </div>
    </div>
  );
}
