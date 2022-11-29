import { RefObject } from 'react';
import { Category } from '../../core/Enums/Category';

type NavbarDirection = 'left' | 'right' | 'bottom';
type NavbarCategoryName = keyof typeof Category;

export interface NavbarProps {
  direction: NavbarDirection;
  categories: NavbarCategoryName[];
  selected?: NavbarCategoryName | null;
  resizable?: boolean;
  submenuWidth?: number;
  submenuRef?: RefObject<HTMLDivElement>;
  onSelect?: (category: NavbarCategoryName | null) => void;
  onResize?: () => void;
  onStopResize?: () => void;
}
