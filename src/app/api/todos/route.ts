import { NextRequest, NextResponse } from "next/server";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// In-memory store (resets on redeploy — for demo purposes)
let todos: Todo[] = [
  { id: 1, text: "學習 Next.js", completed: false },
  { id: 2, text: "部署到 Vercel", completed: false },
];
let nextId = 3;

// GET - 取得所有待辦事項
export async function GET() {
  return NextResponse.json(todos);
}

// POST - 新增待辦事項
export async function POST(request: NextRequest) {
  const body = await request.json();
  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const todo: Todo = { id: nextId++, text, completed: false };
  todos.push(todo);
  return NextResponse.json(todo, { status: 201 });
}

// PATCH - 切換完成狀態
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const todo = todos.find((t) => t.id === body.id);
  if (!todo) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  todo.completed = !todo.completed;
  return NextResponse.json(todo);
}

// DELETE - 刪除待辦事項
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const index = todos.findIndex((t) => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const [deleted] = todos.splice(index, 1);
  return NextResponse.json(deleted);
}
