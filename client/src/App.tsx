import { useState } from "react";
import { z } from "zod";
/* 
- add zod to create schema
- create UI
- add handlers and test in local state
- and hook form for validation
- connect handlers with APIs
- test
- move hanlders to state manager
- add react query for request state handling
*/

// Define the schema using Zod

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  completed: z.boolean(),
});

type Todo = z.infer<typeof todoSchema>;

interface TodoItem extends Todo {
  id: number;
}

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<TodoItem | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
    </div>
  );
}
