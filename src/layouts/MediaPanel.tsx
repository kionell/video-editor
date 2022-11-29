import { useRef } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  setMediaCategory,
  setMediaPanelWidth,
} from '../store/Reducers/GeneralSlice';

const MediaPanel: React.FC = () => {
  const general = useAppSelector((state) => state.general);
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
      selected={general.mediaCategory}
      categories={[
        'Media',
        'Text',
        'Transitions',
        'Settings',
      ]}
      submenuWidth={general.mediaPanelWidth}
      submenuRef={submenuRef}
      onSelect={(category) => {
        dispatch(setMediaCategory(category));
      }}
      onStopResize={onStopResize}
    />
  );
};

export { MediaPanel };
