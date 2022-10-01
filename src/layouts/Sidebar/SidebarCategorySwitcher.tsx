import styled from 'styled-components';
import { PropsWithChildren } from 'react';
import { MediaCategory } from './Categories/MediaCategory';

const enum CategoryType {
  Media,
  Text,
  Transition,
  Settings,
}

interface SidebarCategoryProps extends PropsWithChildren {
  categoryType?: keyof typeof CategoryType;
  className?: string;
}

const StyledSidebarCategorySwitcher = styled.div<SidebarCategoryProps>`
  position: relative;
  background: transparent;
  width: 100%;
  height: 100%;
`;

function getCategoryByType(category: keyof typeof CategoryType) {
  switch (category) {
    case 'Media': return MediaCategory;
  }
  
  return MediaCategory;
}

const SidebarCategorySwitcher: React.FC<SidebarCategoryProps> = (props: SidebarCategoryProps) => {
  const SidebarCategory = getCategoryByType('Media'); 
  
  return (
    <StyledSidebarCategorySwitcher>
      <SidebarCategory />
    </StyledSidebarCategorySwitcher>
  );
};

export { SidebarCategorySwitcher };
