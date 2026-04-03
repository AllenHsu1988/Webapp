import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - 取得所有待辦事項
export async function GET() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST - 新增待辦事項
export async function POST(request: NextRequest) {
  const body = await request.json();
  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("todos")
    .insert({ text, completed: false, starred: false })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

// PATCH - 切換完成或星號狀態
export async function PATCH(request: NextRequest) {
  const body = await request.json();

  // 先取得目前的值
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("*")
    .eq("id", body.id)
    .single();

  if (fetchError || !todo) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const updateField =
    body.field === "starred"
      ? { starred: !todo.starred }
      : { completed: !todo.completed };

  const { data, error } = await supabase
    .from("todos")
    .update(updateField)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE - 刪除待辦事項
export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
