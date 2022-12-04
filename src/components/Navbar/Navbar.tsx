import styled, { css } from 'styled-components';
import { createRef } from 'react';
import { ButtonGroup } from '../Buttons/ButtonGroup';
import { FlatButton } from '../Buttons/FlatButton';
import { NavbarSubmenu } from './NavbarSubmenu';
import { NavbarProps } from './NavbarProps';

const StyledNavbarWrapper = styled.div<NavbarProps>`
  display: flex;
  position: relative;

  flex-direction: ${({ direction }) => {
    switch (direction) {
      case 'left': return 'row';
      case 'right': return 'row-reverse';
      case 'bottom': return 'column-reverse';
    }
  }};

  ${({ direction }) => {
    return direction === 'bottom' && css`width: 100%;`;
  }}

  ${({ direction }) => {
    return direction !== 'bottom' && css`height: 100%;`;
  }}
`;

const StyledNavbar = styled.div<NavbarProps>`
  position: relative;
  display: flex;
  z-index: 2;
  background: ${(props) => props.theme.primary.surface};

  width: ${({ direction }) => direction === 'bottom' ? '100%' : '70px' };
  height: ${({ direction }) => direction === 'bottom' ? '70px' : '100%' }; 

  .button-group {
    width: 100%;
    height: 100%;

    ${({ direction }) => {
      return direction === 'bottom' && css`
        justify-content: space-around;
        align-items: center;
      `;
    }}
  }
`;

const StyledNavbarButton = styled(FlatButton)`
  &.toggled {
    background: ${(props) => props.theme.secondary.surface};
  }
`;

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const { onSelect, onResize, onStopResize, ...other } = props;

  return (
    <StyledNavbarWrapper {...other}>
      <StyledNavbar {...other}>
        <ButtonGroup

          direction={props.direction === 'bottom' ? 'row' : 'column'}
          justify={props.direction === 'bottom' ? 'space-around' : 'start'}
          align={props.direction === 'bottom' ? 'center' : 'start'}
        >
          {
            other.categories.map((category) => {
              return (
                <StyledNavbarButton
                  key={category}
                  buttonRef={createRef()}
                  disabled={props.disabled}
                  toggled={category === props.selected}
                  label={category}
                  iconType={category}
                  onClick={() => onSelect?.(category)}
                />
              );
            })
          }
        </ButtonGroup>
      </StyledNavbar>

      {
        other.selected && <NavbarSubmenu
          {...other}
          selected={other.selected}
          onResize={onResize}
          onStopResize={onStopResize}
        />
      }
    </StyledNavbarWrapper>
  );
};

export { Navbar };
