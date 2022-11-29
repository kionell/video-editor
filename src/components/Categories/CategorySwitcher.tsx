import { useEffect, useState } from 'react';
import { CategoryName } from '../../core/Enums/Category';
import { MediaCategory } from './MediaCategory';

interface CategorySwitcherProps {
  selected: CategoryName;
}

function getCategoryBySelected(selected: CategoryName): React.FC {
  switch (selected) {
    case 'Media': return MediaCategory;
  }
}

const CategorySwitcher: React.FC<CategorySwitcherProps> = (props: CategorySwitcherProps) => {
  const [category, setCategory] = useState<CategoryName>();

  useEffect(() => {
    if (!props.selected) return;

    setCategory(props.selected);
  }, [props.selected]);

  const SelectedCategory = getCategoryBySelected(category);

  if (SelectedCategory) return <SelectedCategory />;
};

export { CategorySwitcher };
