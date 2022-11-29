import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { DEFAULT_SETTINGS_PANEL_WIDTH } from '../constants';
import { getAllowedSettings } from '../core/Utils/Timeline';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setSettingsCategory } from '../store/Reducers/GeneralSlice';

const SettingsPanel: React.FC = () => {
  const general = useAppSelector((state) => state.general);
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const [settings, setSettings] = useState(getAllowedSettings());

  const focusedTracks = timeline.focusedTracks;
  const firstFocused = focusedTracks[0]?.focusedElements[0];

  useEffect(() => {
    const allowed = getAllowedSettings(firstFocused);

    if (!allowed.includes(general.settingsCategory) || !focusedTracks.length) {
      dispatch(setSettingsCategory(null));
    }

    setSettings(allowed);
  }, [firstFocused]);

  return (
    <Navbar
      direction='right'
      selected={general.settingsCategory}
      categories={settings}
      disabled={!focusedTracks.length}
      element={firstFocused}
      submenuWidth={DEFAULT_SETTINGS_PANEL_WIDTH}
      onSelect={(category) => {
        dispatch(setSettingsCategory(category));
      }}
    />
  );
};

export { SettingsPanel };
