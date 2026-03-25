export type InventoryAction =
  | "in"
  | "out"
  | "partial"
  | "waste"
  | "salvaged";

export type InventoryLog = {
  id: string;
  materialId: string;
  action: InventoryAction;
  quantity: number;
  jobName?: string;
  note?: string;
  createdAt: string;
};