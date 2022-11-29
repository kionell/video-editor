import { Category } from '../Enums/Category';

export interface IGeneralState {
  /**
   * Current media category.
   */
  mediaCategory: keyof typeof Category | null;

  /**
   * Current media category width.
   */
  mediaCategoryWidth: number;

  /**
   * Current element settings category.
   */
  settingsCategory: keyof typeof Category | null;
}
