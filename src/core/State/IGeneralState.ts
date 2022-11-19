import { SidebarCategory } from '../Enums/SidebarCategory';

export interface IGeneralState {
  currentCategory: keyof typeof SidebarCategory;
}
