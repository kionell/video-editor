import styled, { css } from 'styled-components';
import { MouseEventHandler } from 'react';
import { Text } from '../Text';

interface DropdownItemWrapperProps {
  visible?: boolean;
  offset?: number;
}

const DropdownItemWrapper = styled.div<DropdownItemWrapperProps>`
  visibility: ${(props) => props.visible ? 'visible' : 'hidden'};
  opacity: ${(props) => props.visible ? 1 : 0};
  top: ${(props) => props.offset}px;
  flex-direction: column;
  position: absolute;
  width: 100%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  outline: none;
  z-index: 10;
  transition: opacity 150ms;
`;

export interface DropdownItemProps {
  'data-index'?: number;
  selected?: boolean;
  text?: string;
  height?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const StyledDropdownItem = styled.div<DropdownItemProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(props) => props.height}px;
  outline: none;
  padding-left: 5px;
  outline: none;
  border-radius: 0px;
  background: ${({ selected, theme }) => {
    return selected ? theme.secondary.surface : theme.background;
  }};

  color: ${(props) => props.theme.text.normal};

  ${(props) => {
    if (props.selected) return;

    return css`
      &:hover {
        color: ${(props) => props.theme.text.accent};
        background: ${(props) => props.theme.secondary.accent}
      }
    `;
  }}
`;

const DropdownItem: React.FC<DropdownItemProps> = (props: DropdownItemProps) => {
  const { selected, text } = props;

  return (
    <StyledDropdownItem
      {...props}
      className={selected ? 'selected' : ''}
    >
      <Text text={text} />
    </StyledDropdownItem>
  );
};

DropdownItem.defaultProps = {
  selected: false,
  text: 'Option',
  height: 35,
};

DropdownItemWrapper.defaultProps = {
  visible: false,
  offset: 35,
};

export { DropdownItem, DropdownItemWrapper };
