"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { inventoryLogs } from "../lib/mock-data";
import type { InventoryLog } from "../types/inventory";

type DemoStateContextValue = {
  logs: InventoryLog[];
  addLog: (log: InventoryLog) => void;
};

const DemoStateContext = createContext<DemoStateContextValue | undefined>(undefined);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<InventoryLog[]>(() => inventoryLogs);

  const value = useMemo(
    () => ({
      logs,
      addLog: (log: InventoryLog) => {
        setLogs((currentLogs) => [log, ...currentLogs]);
      },
    }),
    [logs]
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState() {
  const context = useContext(DemoStateContext);

  if (!context) {
    throw new Error("useDemoState must be used within a DemoStateProvider");
  }

  return context;
}
