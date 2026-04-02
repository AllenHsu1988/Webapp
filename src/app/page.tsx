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
    <div className="min-h-screen bg-teal-800 relative">
      {/* Teal header area */}
      <div className="pt-14 pb-24 px-6">
        <p className="text-teal-300/70 text-sm mb-1">{dateStr}</p>
        <h1 className="text-3xl font-bold text-white">我的一天</h1>
      </div>

      {/* White card overlay */}
      <div className="absolute left-0 right-0 top-36 bottom-0 bg-slate-50 rounded-t-3xl shadow-lg px-5 pt-6 pb-10 overflow-y-auto">
        {/* Add todo input */}
        <div className="flex items-center gap-3.5 bg-white rounded-2xl px-4 py-3.5 mb-4 shadow-sm border border-slate-100">
          <div className="shrink-0 w-6 h-6 rounded-full border-2 border-teal-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <input
            className="flex-1 min-w-0 text-base text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            type="text"
            placeholder="新增待辦事項"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
        </div>

        {/* Todo list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200 mx-auto mb-4">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-slate-400 text-base">今天沒有任務</p>
            <p className="text-slate-300 text-sm mt-1">享受美好的一天吧</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3.5 px-4 py-4 ${
                  index < todos.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {/* Checkbox */}
                <button
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-teal-600 border-teal-600"
                      : "border-slate-300"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <span
                  className={`flex-1 text-base cursor-pointer select-none transition-colors ${
                    todo.completed ? "line-through text-slate-400" : "text-slate-700"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>

                {/* Delete */}
                <button
                  className="shrink-0 p-1.5 text-slate-300 active:text-red-400 transition-colors"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
