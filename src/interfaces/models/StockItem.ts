import { Product } from "./Product"

export type StockItem = {
  id: number,
  product: Product,
  quantity: number,
  stock: number
}
