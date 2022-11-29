import { RefObject } from 'react';
import { BaseElement } from '../../core/Elements';
import { CategoryName } from '../../core/Enums/Category';

type NavbarDirection = 'left' | 'right' | 'bottom';

export interface NavbarProps {
  direction: NavbarDirection;
  categories: CategoryName[];
  selected?: CategoryName | null;
  disabled?: boolean;
  resizable?: boolean;
  submenuWidth?: number;
  submenuRef?: RefObject<HTMLDivElement>;
  element?: BaseElement;
  onSelect?: (category: CategoryName | null) => void;
  onResize?: () => void;
  onStopResize?: () => void;
}
