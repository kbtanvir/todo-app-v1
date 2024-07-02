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
