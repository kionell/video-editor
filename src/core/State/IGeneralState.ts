import { CategoryName } from '../Enums/Category';

export interface IGeneralState {
  /**
   * Current media category.
   */
  mediaCategory: CategoryName | null;

  /**
   * Current media category width.
   */
  mediaCategoryWidth: number;

  /**
   * Current element settings category.
   */
  settingsCategory: CategoryName | null;
}
