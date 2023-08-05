export const ScheduleType = {
  BREAKFAST: "breakfast",
  MID_MORNING: "mid-morning",
  LUNCH: "lunch",
  SNACK: "snack",
  DINNER: "dinner",
} as const;
export type ScheduleType = (typeof ScheduleType)[keyof typeof ScheduleType];
