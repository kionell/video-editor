import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/Store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
