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

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
        {/* Title area */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">待辦事項</h1>
          </div>
          {todos.length > 0 && (
            <p className="text-sm text-gray-400 ml-12">
              已完成 {completedCount} / {todos.length} 項
            </p>
          )}
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex gap-3">
            <input
              className="flex-1 min-w-0 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-400 focus:bg-white transition-all"
              type="text"
              placeholder="新增待辦事項..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <button
              className="flex-shrink-0 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
              onClick={addTodo}
            >
              新增
            </button>
          </div>
        </div>

        {/* Todo list card */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-16 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">目前沒有待辦事項</p>
            <p className="text-gray-400 text-xs mt-1">輸入文字並點擊「新增」開始吧</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className={`flex items-center gap-4 px-5 py-4 ${
                  index < todos.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Checkbox */}
                <button
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                    todo.completed
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 hover:border-blue-400"
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
                  className={`flex-1 text-sm cursor-pointer select-none transition-colors ${
                    todo.completed ? "line-through text-gray-300" : "text-gray-700"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>

                {/* Delete - always visible on mobile */}
                <button
                  className="flex-shrink-0 p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-all"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-300 text-xs mt-8">
          Built with Next.js + Tailwind CSS
        </p>
      </div>
    </main>
  );
}
