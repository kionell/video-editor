import styled from 'styled-components';
import { PropsWithChildren } from 'react';
import { MediaCategory } from './Categories/MediaCategory';
import { SidebarCategory } from '../../core/Enums/SidebarCategory';

interface SidebarCategoryProps extends PropsWithChildren {
  categoryType?: keyof typeof SidebarCategory;
  className?: string;
}

const StyledSidebarCategorySwitcher = styled.div<SidebarCategoryProps>`
  position: relative;
  background: transparent;
  width: 100%;
  height: 100%;
`;

function getCategoryByType(category: keyof typeof SidebarCategory) {
  switch (category) {
    case 'Media': return MediaCategory;
  }

  return MediaCategory;
}

const SidebarCategorySwitcher: React.FC<SidebarCategoryProps> = () => {
  const SidebarCategory = getCategoryByType('Media');

  return (
    <StyledSidebarCategorySwitcher>
      <SidebarCategory />
    </StyledSidebarCategorySwitcher>
  );
};

export { SidebarCategorySwitcher };
