import { Todo } from "./model";
import { todoProvider } from "./provider";

// SERVICE CONFIG
// -----------------------

export class TodoService {
  async getOne(editingId: number | undefined): Promise<Todo | undefined> {
    try {
      const response = await fetch(`http://127.0.0.1:5000/todos/${editingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  async fetchTodos() {
    todoProvider.setEditingId(undefined);
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
      todoProvider.setList(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async addTodo(todo: Todo) {
    await fetch("http://127.0.0.1:5000/todos", {
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
      await fetch(`http://127.0.0.1:5000/todos/${todo.id}`, {
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
    const response = await fetch(`http://127.0.0.1:5000/todos/${id}`);

    const todo: Todo = await response.json();

    // Update the completed status

    todo.completed = completed;

    // Send the updated todo item back to the server
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
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
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: "DELETE",
    });
    this.fetchTodos();
  }
}

export const todoService = new TodoService();
