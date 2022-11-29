import { RefObject } from 'react';
import { CategoryName } from '../../core/Enums/Category';

type NavbarDirection = 'left' | 'right' | 'bottom';

export interface NavbarProps {
  direction: NavbarDirection;
  categories: CategoryName[];
  selected?: CategoryName | null;
  resizable?: boolean;
  submenuWidth?: number;
  submenuRef?: RefObject<HTMLDivElement>;
  onSelect?: (category: CategoryName | null) => void;
  onResize?: () => void;
  onStopResize?: () => void;
}
