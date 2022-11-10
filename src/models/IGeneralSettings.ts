import { SidebarCategory } from './Enums/SidebarCategory';

export interface IGeneralSettings {
  currentCategory: keyof typeof SidebarCategory;
}
