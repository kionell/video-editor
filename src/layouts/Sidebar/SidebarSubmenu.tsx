import styled from 'styled-components';
import { PropsWithChildren } from 'react';
import { SidebarCategorySwitcher } from './SidebarCategorySwitcher';

interface SidebarSubmenuProps extends PropsWithChildren {
  className?: string;
}

const StyledSidebarSubmenu = styled.div<SidebarSubmenuProps>`
  width: 325px;
  height: 100%;
  position: relative;
  background: ${(props) => props.theme.container.secondary};
`;

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = (props: SidebarSubmenuProps) => {
  return (
    <StyledSidebarSubmenu {...props}>
      <SidebarCategorySwitcher {...props}/>
    </StyledSidebarSubmenu>
  );
};

export { SidebarSubmenu };
