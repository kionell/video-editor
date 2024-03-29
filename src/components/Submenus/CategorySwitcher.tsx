import { useEffect, useState } from 'react';
import { CategoryName } from '../../core/Enums/Category';
import { AdjustSettings } from './AdjustSettings';
import { FadeSettings } from './FadeSettings';
import { MediaCategory } from './MediaCategory';
import { SpeedSettings } from './SpeedSettings';
import { TransformSettings } from './TransformSettings';
import { VolumeSettings } from './VolumeSettings';

interface CategorySwitcherProps {
  selected: CategoryName;
}

function getCategoryBySelected(selected: CategoryName): React.FC {
  switch (selected) {
    case 'Media': return MediaCategory;
    case 'Transform': return TransformSettings;
    case 'Volume': return VolumeSettings;
    case 'Speed': return SpeedSettings;
    case 'Fade': return FadeSettings;
    case 'Filters':
    case 'Adjust': return AdjustSettings;
  }
}

const CategorySwitcher: React.FC<CategorySwitcherProps> = (props: CategorySwitcherProps) => {
  const [category, setCategory] = useState<CategoryName>();

  useEffect(() => {
    if (!props.selected) return;

    setCategory(props.selected);
  }, [props.selected]);

  const SelectedCategory = getCategoryBySelected(category);

  if (SelectedCategory) {
    return <SelectedCategory />;
  }
};

export { CategorySwitcher };
