import { CategoryName } from '../Enums/Category';

export interface IGeneralState {
  /**
   * Current media category.
   */
  mediaCategory: CategoryName | null;

  /**
   * Current media panel width.
   */
  mediaPanelWidth: number;

  /**
   * Current element settings category.
   */
  settingsCategory: CategoryName | null;

  /**
   * Whether to show export menu or not.
   */
  showExportMenu?: boolean;
}
