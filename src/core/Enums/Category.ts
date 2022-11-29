export enum Category {
  Media,
  Text,
  Transitions,
  Settings,
  Transform,
  Volume,
  Speed,
  Fade,
  Filters,
  Adjust,
}

export type CategoryName = keyof typeof Category;
