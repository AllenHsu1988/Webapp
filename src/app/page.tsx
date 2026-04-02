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
    <main className="min-h-screen bg-teal-800 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-14 pb-28">
        <p className="text-teal-300/70 text-sm mb-1">{dateStr}</p>
        <h1 className="text-3xl font-bold text-white">我的一天</h1>
      </div>

      {/* White card area */}
      <div className="flex-1 bg-gray-50 -mt-16 rounded-t-[2rem] px-5 pt-6 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Add todo row */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 mb-5">
          <div className="flex-shrink-0 w-6 h-6 rounded-full border-[2.5px] border-teal-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <input
            className="flex-1 min-w-0 text-[15px] text-gray-800 placeholder-gray-400 outline-none bg-transparent"
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
            <div className="w-6 h-6 border-[2.5px] border-gray-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-400 text-[15px]">今天沒有任務</p>
            <p className="text-gray-300 text-sm mt-1">享受美好的一天吧</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3.5 bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100"
              >
                {/* Checkbox */}
                <button
                  className={`flex-shrink-0 w-[22px] h-[22px] rounded-full border-[2.5px] transition-all flex items-center justify-center ${
                    todo.completed
                      ? "bg-teal-600 border-teal-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <span
                  className={`flex-1 text-[15px] cursor-pointer select-none transition-colors ${
                    todo.completed ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>

                {/* Star / Delete */}
                <button
                  className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 active:text-red-400 transition-colors"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
