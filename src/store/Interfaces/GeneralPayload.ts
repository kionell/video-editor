import { PayloadAction } from '@reduxjs/toolkit';
import { NavbarCategory } from '../../components/Navbar/Navbar';

export type CategoryPayload = keyof typeof NavbarCategory | null;
export type CategoryAction = PayloadAction<CategoryPayload>;
