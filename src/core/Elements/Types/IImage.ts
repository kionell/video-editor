import { ImageFile } from '../../Files/ImageFile';
import { IFileElement } from './IFileElement';
import { IVisible } from './IVisible';

export interface IImage extends IVisible, IFileElement<ImageFile> {}
