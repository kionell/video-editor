import styled from 'styled-components';
import { PropsWithChildren, useRef } from 'react';
import { useResizable } from '../../hooks/useResizable';
import { ResizerLine } from '../Containers/Resizer';
import { SidebarCategorySwitcher } from './SidebarCategorySwitcher';
import { FlexContainer } from '../Containers/FlexContainer';

interface SidebarSubmenuProps extends PropsWithChildren {
  className?: string;
}

const StyledSidebarSubmenu = styled(FlexContainer)<SidebarSubmenuProps>`
  min-width: 176px; // 1 item per row
  width: 336px; // 2 items per row
  max-width: 496px; // 3 items per row
  height: 100%;
  position: relative;
  gap: 0px;
  padding: 0px;
  background: ${(props) => props.theme.secondary.surface};
`;

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = (props: SidebarSubmenuProps) => {
  const sidebarRef = useRef();

  useResizable(sidebarRef);

  return (
    <StyledSidebarSubmenu {...props} ref={sidebarRef}>
      <SidebarCategorySwitcher {...props}/>
      <ResizerLine direction='right' />
    </StyledSidebarSubmenu>
  );
};

export { SidebarSubmenu };
