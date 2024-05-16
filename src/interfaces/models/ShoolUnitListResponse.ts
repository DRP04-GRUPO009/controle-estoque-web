import { SchoolUnit } from "./SchoolUnit"

export type SchoolUnitListResponse = {
  count: number,
  next: string | null,
  previous: string | null,
  results: SchoolUnit[]
}
