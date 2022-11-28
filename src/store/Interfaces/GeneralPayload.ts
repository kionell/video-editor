import { PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../core/Enums/Category';

export type CategoryPayload = keyof typeof Category | null;
export type CategoryAction = PayloadAction<CategoryPayload>;
