import { useEffect, useState } from 'react';
import { Category } from '../../core/Enums/Category';
import { MediaCategory } from './MediaCategory';

type SelectedCategory = keyof typeof Category;

interface CategorySwitcherProps {
  selected: SelectedCategory;
}

function getCategoryBySelected(selected: SelectedCategory): React.FC {
  switch (selected) {
    case 'Media': return MediaCategory;
  }
}

const CategorySwitcher: React.FC<CategorySwitcherProps> = (props: CategorySwitcherProps) => {
  const [category, setCategory] = useState<keyof typeof Category>();

  useEffect(() => {
    if (!props.selected) return;

    setCategory(props.selected);
  }, [props.selected]);

  const SelectedCategory = getCategoryBySelected(category);

  if (SelectedCategory) return <SelectedCategory />;
};

export { CategorySwitcher };
