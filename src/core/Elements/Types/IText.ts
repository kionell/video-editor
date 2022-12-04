import { IBaseElement } from './IBaseElement';
import { IHasText } from './IHasText';
import { IVisible } from './IVisible';

export interface IText extends IBaseElement, IHasText, IVisible {}
