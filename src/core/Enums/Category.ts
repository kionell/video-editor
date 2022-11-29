export enum Category {
  Media,
  Text,
  Transitions,
  Settings,
  Transform,
  Speed,
  Fade,
  Filters,
  Adjust,
  Volume,
}

export type CategoryName = keyof typeof Category;
