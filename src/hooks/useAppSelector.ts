import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store/Store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
