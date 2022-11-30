import { useRef } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectMediaCategory, selectMediaPanelWidth } from '../store';
import {
  setMediaCategory,
  setMediaPanelWidth,
} from '../store/Reducers/GeneralSlice';

const MediaPanel: React.FC = () => {
  const mediaCategory = useAppSelector(selectMediaCategory);
  const mediaPanelWidth = useAppSelector(selectMediaPanelWidth);
  const dispatch = useAppDispatch();
  const submenuRef = useRef<HTMLDivElement>(null);

  const onStopResize = () => {
    if (!submenuRef?.current.style.width) return;

    const width = parseFloat(submenuRef.current.style.width);

    dispatch(setMediaPanelWidth(width));
  };

  return (
    <Navbar
      resizable
      direction='left'
      selected={mediaCategory}
      categories={[
        'Media',
        'Text',
        'Transitions',
        'Settings',
      ]}
      submenuWidth={mediaPanelWidth}
      submenuRef={submenuRef}
      onSelect={(category) => {
        dispatch(setMediaCategory(category));
      }}
      onStopResize={onStopResize}
    />
  );
};

export { MediaPanel };
