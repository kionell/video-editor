import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { DEFAULT_SETTINGS_PANEL_WIDTH } from '../constants';
import { MediaType } from '../core/Enums/MediaType';
import { getAllowedSettings } from '../core/Utils/Timeline';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectFocusedElementType, selectSettingsCategory } from '../store';
import { setSettingsCategory } from '../store/Reducers/GeneralSlice';

const SettingsPanel: React.FC = () => {
  const settingsCategory = useAppSelector(selectSettingsCategory);
  const focusedElementType = useAppSelector(selectFocusedElementType);
  const dispatch = useAppDispatch();

  const [settings, setSettings] = useState(getAllowedSettings(focusedElementType));

  useEffect(() => {
    const allowed = getAllowedSettings(focusedElementType);

    if (!allowed.includes(settingsCategory) || focusedElementType === MediaType.Unknown) {
      dispatch(setSettingsCategory(null));
    }

    setSettings(allowed);
  }, [focusedElementType]);

  return (
    <Navbar
      direction='right'
      selected={settingsCategory}
      categories={settings}
      disabled={focusedElementType === MediaType.Unknown}
      submenuWidth={DEFAULT_SETTINGS_PANEL_WIDTH}
      onSelect={(category) => {
        dispatch(setSettingsCategory(category));
      }}
    />
  );
};

export { SettingsPanel };
