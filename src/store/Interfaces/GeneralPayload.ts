import { PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../core/Enums/Category';

export type CategoryWidthPayload = number;
export type CategoryPayload = keyof typeof Category | null;

export type CategoryWidthAction = PayloadAction<CategoryWidthPayload>;
export type CategoryAction = PayloadAction<CategoryPayload>;
