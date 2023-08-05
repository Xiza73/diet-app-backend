export const Unity = {
  GRAM: "gram",
  KILOGRAM: "kilogram",
  LITER: "liter",
  MILLILITER: "milliliter",
  UNIT: "unit",
} as const;
export type Unity = typeof Unity[keyof typeof Unity];