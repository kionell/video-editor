import styled, { css } from 'styled-components';
import { MouseEventHandler } from 'react';
import { Text } from '../Text';

interface DropdownItemWrapperProps {
  visible?: boolean;
  offset?: number;
}

const DropdownItemWrapper = styled.div<DropdownItemWrapperProps>`
  display: ${(props) => props.visible ? 'flex' : 'none'};
  top: ${(props) => props.offset}px;
  flex-direction: column;
  position: absolute;
  width: 100%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  outline: none;
  z-index: 1;
`;

export interface DropdownItemProps {
  'data-index'?: number;
  selected?: boolean;
  text?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const StyledDropdownItem = styled.div<DropdownItemProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  outline: none;
  padding-left: 5px;
  outline: none;
  border-radius: 0px;
  background: ${(props) => props.theme.secondary.normal};
  color: ${(props) => props.theme.text.normal};

  ${(props) => {
    if (props.selected) return;

    return css`
      &:hover {
        color: ${(props) => props.theme.text.lighter};
        background: ${(props) => props.theme.secondary.accentHover}
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
};

DropdownItemWrapper.defaultProps = {
  visible: false,
  offset: 40,
};

export { DropdownItem, DropdownItemWrapper };
