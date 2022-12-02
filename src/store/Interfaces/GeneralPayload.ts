import { PayloadAction } from '@reduxjs/toolkit';
import { CategoryName } from '../../core/Enums/Category';

export type CategoryWidthPayload = number;
export type CategoryPayload = CategoryName | null;
export type ExportMenuVisiblePayload = boolean;

export type CategoryWidthAction = PayloadAction<CategoryWidthPayload>;
export type CategoryAction = PayloadAction<CategoryPayload>;
export type ExportMenuVisibleAction = PayloadAction<ExportMenuVisiblePayload>;
