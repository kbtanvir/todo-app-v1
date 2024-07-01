import { createStore } from "@poly-state/poly-state";
import { useStore } from "@poly-state/react";
import { Todo } from "./model";

// PROVIDER CONFIG
// -----------------------

export const initialState = {
  list: [] as Todo[],
  editingId: undefined as number | undefined,
};

export type IStore = typeof initialState;

export const provider = createStore(initialState);

export const useProvider = () => useStore<IStore>(provider);

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
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  async fetchTodos() {
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

      provider.setList(data);
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

    provider.setEditingId(undefined);

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
