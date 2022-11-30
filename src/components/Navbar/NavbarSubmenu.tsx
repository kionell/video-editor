import styled from 'styled-components';
import { useRef } from 'react';
import { useResizable } from '../../hooks/useResizable';
import { ResizerLine } from '../Containers/Resizer';
import { CategorySwitcher } from '../Submenus/CategorySwitcher';
import { NavbarProps } from './NavbarProps';
import {
  MIN_MEDIA_PANEL_WIDTH,
  MAX_MEDIA_PANEL_WIDTH,
} from '../../constants';

type NavbarSubmenuProps = Required<Pick<NavbarProps, 'selected'>>
  & Omit<NavbarProps, 'onSelect'>;

const StyledNavbarSubmenu = styled.div<NavbarSubmenuProps>`
  display: flex;
  width: ${(props) => props.submenuWidth}px;
  min-width: ${MIN_MEDIA_PANEL_WIDTH}px;
  max-width: ${MAX_MEDIA_PANEL_WIDTH}px;
  height: 100%;
  position: relative;
  gap: 0px;
  padding: 0px;
  background: ${(props) => props.theme.secondary.surface};

  flex-direction: ${({ direction }) => {
    switch (direction) {
      case 'left': return 'row-reverse';
      case 'right': return 'row';
      case 'bottom': return 'column-reverse';
    }
  }};
`;

const NavbarSubmenu: React.FC<NavbarSubmenuProps> = (props: NavbarSubmenuProps) => {
  const { onResize, onStopResize, ...other } = props;

  const submenuRef = other.submenuRef ?? useRef(null);

  const getResizerDirection = () => {
    switch (other.direction) {
      case 'left': return 'right';
      case 'right': return 'left';
      case 'bottom': return 'top';
    }
  };

  useResizable(submenuRef, {
    resizeCallback: onResize,
    stopResizeCallback: onStopResize,
  });

  return (
    <StyledNavbarSubmenu {...other} ref={submenuRef}>
      <CategorySwitcher selected={other.selected} />
      {
        other.resizable && <ResizerLine direction={getResizerDirection()} />
      }
    </StyledNavbarSubmenu>
  );
};

NavbarSubmenu.defaultProps = {
  resizable: false,
};

export { NavbarSubmenu };
