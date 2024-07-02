import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { FormErrorMessage } from "./components/FormMessage";
import { Spinner } from "./components/Spinner";
import { Todo, todoSchema } from "./features/todo/model";
import { provider, useProvider } from "./features/todo/provider";
import { todoService } from "./features/todo/repo";

function ListItem({ todo }: { todo: Todo }) {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <div
      key={todo.id}
      className={twMerge(
        ` text-black shadow-md rounded-md py-4 px-4 mb-4 flex justify-between items-center hover:shadow-xl transition ease-in-out  duration-300 gap-5 max-[400px]:grid max-[400px]:gap-3 w-full max-[400px]:justify-stretch`,
        todo.completed ? "bg-purple-200" : "bg-white"
      )}
    >
      <div className="flex gap-5 ">
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
          <p className="text-lg text-gray-700 font-semibold pb-1 max-[400px]:text-sm">
            {todo.title}
          </p>
          <p className="text-[12px] text-gray-500">{todo.description}</p>
        </div>
      </div>
      <div className="flex gap-2 self-start mt-1  max-[400px]:justify-end">
        <button
          onClick={() => provider.setEditingId(todo.id)}
          className={twMerge(
            `bg-purple-200 text-black size-[42px]  rounded-[50%] hover:bg-purple-300 hover:text-black transition-colors ease-in-out  duration-300 max-[400px]:size-[30px] p-0 flex items-center justify-center`,
            todo.completed && "bg-white hover:bg-gray-100"
          )}
        >
          <MdModeEditOutline className="text-lg relative  max-[400px]:size-[15px]" />
        </button>
        <button
          className={twMerge(
            `bg-rose-200 text-black size-[42px]  rounded-[50%] hover:bg-rose-300 transition-colors ease-in-out  duration-300 max-[400px]:size-[30px] p-0 flex items-center justify-center disabled:bg-gray-100`,
            todo.completed && "bg-white hover:bg-gray-100"
          )}
          onClick={async () => {
            setIsDeleting(true);
            await todoService.deleteTodo(todo.id);
            setIsDeleting(false);
          }}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Spinner />
          ) : (
            <MdOutlineDeleteOutline className="text-lg  relative  " />
          )}
        </button>
      </div>
    </div>
  );
}

function TodoList() {
  // Queries

  const { list } = useProvider();

  const query = useQuery("todos", todoService.fetchTodos);

  if (query.isLoading) {
    return (
      <Skeleton
        className="mb-[16px]"
        count={3}
        height={82}
        baseColor="white"
      />
    );
  }

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
  // STATES
  //-------------

  const [item, setitem] = useState<Todo | undefined>(undefined);
  const { editingId } = useProvider();
  const [loading, setIsLoading] = useState(false);

  // FORM CONFIG
  //-------------

  const form = useForm<Todo>({
    resolver: zodResolver(todoSchema),
  });

  async function onSubmit(data: Todo) {
    setIsLoading(true);
    await todoService.updateTodo(data);
    form.reset(defaultValues);
    setIsLoading(false);
  }

  // SIDE EFFECTS
  //-------------

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
              disabled={loading}
              className="bg-purple-200 text-black size-[42px] rounded-[50%] hover:bg-purple-300 hover:text-black transition  ease-in-out  duration-300 max-[400px]:size-[30px] p-0 flex items-center justify-center disabled:bg-gray-100"
            >
              {loading ? (
                <Spinner />
              ) : (
                <FaCheck className="text-md relative  " />
              )}
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
