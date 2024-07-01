import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormErrorMessage } from "./components/FormMessage";
import { Todo, todoSchema } from "./features/todo/model";
import { provider, todoService, useProvider } from "./features/todo/store";

function ListItem({ todo }: { todo: Todo }) {
  const { editingId } = useProvider();
  return (
    <div
      key={todo.id}
      className="bg-white text-black shadow-md rounded-md p-4 mb-4 flex justify-between items-center"
    >
      {editingId && <SingleItemForm item={todo} />}
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
                todoService.updateTodo({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />
            <span className="ml-2 text-gray-700">Completed</span>
          </label>
        </div>
      </div>
      <div>
        <button
          onClick={() => provider.setEditingId(todo.id)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => todoService.deleteTodo(todo.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function TodoList() {
  const { list } = useProvider();

  useEffect(() => {
    todoService.fetchTodos();
  }, []);

  if (!list.length) {
    return <>No todos</>;
  }

  return (
    <div className="mt-4">
      {list.map(todo => (
        <ListItem todo={todo} />
      ))}
    </div>
  );
}

function SingleItemForm({ item }: { item?: Todo }) {
  const form = useForm<Todo>({
    resolver: zodResolver(todoSchema),
  });

  function onSubmit(data: Todo) {
    todoService.updateTodo(data);
    
  }

  useEffect(() => {
    if (!item) {
      return form.reset({});
    }

    form.reset(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(item)]);

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              {...form.register("title")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
            />

            <FormErrorMessage name={"title"} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              {...form.register("description")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <FormErrorMessage name={"description"} />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...form.register("completed")}
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
              {item!.id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <TodoList />
    </div>
  );
}
