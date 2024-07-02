import { Todo } from "./model";
import { provider } from "./provider";

// SERVICE CONFIG
// -----------------------

export class TodoService {
  async getOne(editingId: number | undefined): Promise<Todo | undefined> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/todos/${editingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  async fetchTodos() {
    provider.setEditingId(undefined);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/todos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      provider.setList(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async addTodo(todo: Todo) {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    this.fetchTodos();
  }

  async updateTodo(todo: Todo) {
    if (todo.id) {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
    } else {
      await this.addTodo(todo);
    }

    this.fetchTodos();
  }

  async setStatus(id: number, completed: boolean) {
    // Fetch the current todo item
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/todos/${id}`
    );

    const todo: Todo = await response.json();

    // Update the completed status

    todo.completed = completed;

    // Send the updated todo item back to the server
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    // Fetch the updated list of todos
    this.fetchTodos();
  }

  async deleteTodo(id: Todo["id"]) {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/todos/${id}`, {
      method: "DELETE",
    });
    this.fetchTodos();
  }
}

export const todoService = new TodoService();
