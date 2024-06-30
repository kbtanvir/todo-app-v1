import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

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
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      "title": "Go to school",
      "description":
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam eligendi beatae nostrum perferendis saepe voluptate, illo laudantium excepturi error iure corporis nesciunt facilis eum dicta at assumenda quisquam repellendus dolore? ",
      "id": 1,
      "completed": true,
    },
    {
      "title": "Try that sandwitch",
      "description":
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam eligendi beatae nostrum perferendis saepe voluptate, illo laudantium excepturi error iure corporis nesciunt facilis eum dicta at assumenda quisquam repellendus dolore?",
      "id": 2,
      "completed": false,
    },
    {
      "title": "Sleep early",
      "description":
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam eligendi beatae nostrum perferendis saepe voluptate, illo laudantium excepturi error iure corporis nesciunt facilis eum dicta at assumenda quisquam repellendus dolore?",
      "id": 3,
      "completed": true,
    },
  ]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<TodoItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Todo>({
    resolver: zodResolver(todoSchema),
  });

  const onSubmit: SubmitHandler<Todo> = data => {
    if (isEditing) {
      updateTodo(currentTodo!.id, data);
      setIsEditing(false);
      setCurrentTodo(null);
    } else {
      addTodo(data);
    }
    reset({ title: "", description: "", completed: false });
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/todos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const addTodo = async (todo: Todo) => {
    await fetch("http://127.0.0.1:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    fetchTodos();
  };
  const updateTodo = async (id: number, todo: Todo) => {
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  const handleEditTodo = (todo: TodoItem) => {
    setCurrentTodo(todo);
    reset(todo);
    setIsEditing(true);
  };
  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="bg-white shadow-md rounded-md p-4 mb-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register("completed")}
                className="form-checkbox h-5 w-5 "
              />
              <span className="ml-2 text-gray-700">Completed</span>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="bg-white text-black shadow-md rounded-md p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-bold">{todo.title}</h2>
              <p>{todo.description}</p>
              <div>
                <label className="inline-flex items-center mt-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-gray-600"
                    checked={todo.completed}
                    onChange={() =>
                      setTodos(
                        todos.map(t =>
                          t.id === todo.id
                            ? { ...t, completed: !t.completed }
                            : t
                        )
                      )
                    }
                  />
                  <span className="ml-2 text-gray-700">Completed</span>
                </label>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleEditTodo(todo)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
