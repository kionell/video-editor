import { Navbar } from '../components/Navbar/Navbar';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setSettingsCategory } from '../store/Reducers/GeneralSlice';

const SettingsPanel: React.FC = () => {
  const general = useAppSelector((state) => state.general);
  const dispatch = useAppDispatch();

  return (
    <Navbar
      direction='right'
      selected={general.settingsCategory}
      categories={[
        'Transform',
        'Volume',
        'Speed',
        'Fade',
        'Filters',
        'Adjust',
      ]}
      onSelect={(category) => {
        dispatch(setSettingsCategory(category));
      }}
    />
  );
};

export { SettingsPanel };
