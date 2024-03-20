import { StockItem } from "./StockItem"

export type Stock = {
  id: number,
  items: StockItem[],
  school_unit: number
}
