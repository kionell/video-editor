import { Filter } from '../../Enums/Filter';

/**
 * An element that can have filters applied.
 */
export interface IHasFilters {
  /**
   * Array of applied filters.
   */
  filters: Filter[];
}