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

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <main className="min-h-screen flex justify-center items-start px-4 py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Decorative blurred circles */}
      <div className="fixed top-[-10%] left-[-5%] w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl mb-4 shadow-lg shadow-violet-500/30">
            <span className="text-2xl">&#9745;</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Todo App
          </h1>
          <p className="text-purple-300/70 text-sm mt-1">
            Next.js 全端應用 &middot; Vercel
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-8">
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-purple-300/40 text-sm outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
            type="text"
            placeholder="新增待辦事項..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold cursor-pointer hover:from-violet-600 hover:to-indigo-600 active:scale-95 transition-all shadow-lg shadow-violet-500/25"
            onClick={addTodo}
          >
            新增
          </button>
        </div>

        {/* Progress bar */}
        {todos.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-purple-300/60 mb-2">
              <span>進度</span>
              <span>{completedCount} / {todos.length} 完成</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Todo list */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3 opacity-50">&#128221;</div>
            <p className="text-purple-300/50 text-sm">
              目前沒有待辦事項，新增一個吧！
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  todo.completed
                    ? "bg-white/5"
                    : "bg-white/10 hover:bg-white/15"
                }`}
              >
                <button
                  className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                    todo.completed
                      ? "bg-gradient-to-br from-violet-500 to-indigo-500 border-transparent"
                      : "border-purple-300/30 hover:border-violet-400"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 text-sm cursor-pointer transition-all ${
                    todo.completed
                      ? "line-through text-purple-300/30"
                      : "text-white/90"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>
                <button
                  className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg text-xs text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
                  onClick={() => deleteTodo(todo.id)}
                >
                  刪除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
