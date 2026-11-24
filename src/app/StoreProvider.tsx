"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";

function createStore() {
  const store = makeStore();
  return { store, initialState: store.getState() };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [{ store, initialState }] = useState(createStore);
  return (
    <Provider store={store} serverState={initialState}>
      {children}
    </Provider>
  );
}
