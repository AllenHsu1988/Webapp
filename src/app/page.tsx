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
    <main className="min-h-screen flex justify-center items-start pt-20 bg-gradient-to-br from-indigo-500 to-purple-700">
      <div className="bg-white rounded-2xl p-10 w-full max-w-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-1">Todo App</h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Next.js 全端應用 - 部署於 Vercel
        </p>

        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-base outline-none focus:border-indigo-500 transition-colors"
            type="text"
            placeholder="新增待辦事項..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            className="px-5 py-3 rounded-lg bg-indigo-500 text-white text-base font-bold cursor-pointer hover:bg-indigo-600 transition-colors"
            onClick={addTodo}
          >
            新增
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-5">載入中...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-300 py-5">
            目前沒有待辦事項，新增一個吧！
          </p>
        ) : (
          <ul className="list-none p-0">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span
                  className={`cursor-pointer text-base flex-1 ${
                    todo.completed ? "line-through opacity-50" : ""
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed ? "\u2705" : "\u2B1C"} {todo.text}
                </span>
                <button
                  className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm cursor-pointer hover:bg-red-600 transition-colors"
                  onClick={() => deleteTodo(todo.id)}
                >
                  刪除
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="text-center text-gray-400 mt-4 text-sm">
          完成 {todos.filter((t) => t.completed).length} / {todos.length} 項
        </p>
      </div>
    </main>
  );
}
