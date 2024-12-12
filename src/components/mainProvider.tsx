import React, { createContext, useContext } from "react";
import { MainStore } from "../store/main";

const MainStoreContext = createContext<MainStore | null>(null);

export const CounterProvider = ({
  store,
  children,
}: {
  store: MainStore;
  children: React.ReactNode;
}) => (
  <MainStoreContext.Provider value={store}>{children}</MainStoreContext.Provider>
);

export const useMainStore = () => {
  const store = useContext(MainStoreContext);
  if (!store) {
    throw new Error("useCounterStore 必须在 CounterProvider 内使用");
  }
  return store;
};