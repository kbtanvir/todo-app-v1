import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { FormErrorMessage } from "./components/FormMessage";
import { Todo, todoSchema } from "./features/todo/model";
import { provider, todoService, useProvider } from "./features/todo/store";
function ListItem({ todo }: { todo: Todo }) {
  return (
    <div
      key={todo.id}
      className={twMerge(
        ` text-black shadow-md rounded-md py-4 px-4 mb-4 flex justify-between items-center hover:shadow-xl transition ease-in-out  duration-300 gap-10`,
        todo.completed ? "bg-purple-200" : "bg-white"
      )}
    >
      <div className="flex gap-5">
        <div className="inline-flex items-center mt-2 self-start">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() =>
              todoService.updateTodo({
                ...todo,
                completed: !todo.completed,
              })
            }
          />
        </div>
        <div
          className={twMerge(`grid`, todo.completed && "[&>p]:line-through")}
        >
          <p className="text-lg text-gray-700 font-semibold pb-1">
            {todo.title}
          </p>
          <p className="text-[12px] text-gray-500">{todo.description}</p>
        </div>
      </div>
      <div className="flex gap-2 self-start mt-1">
        <button
          onClick={() => provider.setEditingId(todo.id)}
          className={twMerge(
            `bg-purple-200 text-black size-[42px]  rounded-[50%] hover:bg-purple-300 hover:text-black transition-colors ease-in-out  duration-300 `,
            todo.completed && "bg-white hover:bg-gray-100"
          )}
        >
          <MdModeEditOutline className="text-lg relative right-2" />
        </button>
        <button
          className={twMerge(
            `bg-rose-200 text-black size-[42px]  rounded-[50%] hover:bg-rose-300 hover:text-black transition-colors ease-in-out  duration-300`,
            todo.completed && "bg-white hover:bg-gray-100"
          )}
          onClick={() => todoService.deleteTodo(todo.id)}
        >
          <MdOutlineDeleteOutline className="text-lg  relative right-2" />
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
        <ListItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
const defaultValues: Todo = {
  "title": "",
  "description": "",
  "completed": false,
};
function SingleItemForm() {
  const [item, setitem] = useState<Todo | undefined>(undefined);
  const { editingId } = useProvider();

  const form = useForm<Todo>({
    resolver: zodResolver(todoSchema),
  });

  function onSubmit(data: Todo) {
    todoService.updateTodo(data).then(() => form.reset(defaultValues));
  }

  useEffect(() => {
    form.reset(defaultValues);

    if (!item || item.id !== editingId) {
      return form.reset(defaultValues);
    }

    form.reset(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(item), editingId]);

  useEffect(() => {
    if (!editingId) {
      form.reset(defaultValues);
      return;
    }

    todoService.getOne(editingId).then(item => {
      form.reset(item);
      if (item) {
        setitem(item);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4 ">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              {...form.register("title")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
            />

            <FormErrorMessage name={"title"} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700  mb-2">Description</label>
            <textarea
              {...form.register("description")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <FormErrorMessage name={"description"} />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-200 text-black size-[42px] rounded-[50%] hover:bg-purple-300 hover:text-black transition-colors ease-in-out  duration-300"
            >
              <FaCheck className="text-md relative right-[7px]" />
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default function App() {
  return (
    <div className=" p-4  min-h-[100vh] w-full bg-purple-200">
      <div className="container mx-auto max-w-[500px]">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <SingleItemForm />
        <TodoList />
      </div>
    </div>
  );
}
