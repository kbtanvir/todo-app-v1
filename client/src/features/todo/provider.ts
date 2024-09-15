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

export const todoProvider = createStore(initialState);

export const useTodoProvider = () => useStore<IStore>(todoProvider);
