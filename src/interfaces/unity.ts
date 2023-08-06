export const Unity = {
  GRAM: "gram",
  KILOGRAM: "kilogram",
  LITER: "liter",
  MILLILITER: "milliliter",
  UNIT: "unit",
  CUP: "cup",
  SPOON: "spoon",
  TEASPOON: "teaspoon",
  PIECE: "piece",
} as const;
export type Unity = typeof Unity[keyof typeof Unity];