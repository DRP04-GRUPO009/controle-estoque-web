import { Product } from "./Product"

export type ProductListResponse = {
  count: number,
  next: string | null,
  previous: string | null,
  results: Product[]
}