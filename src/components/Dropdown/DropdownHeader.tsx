import styled, { css } from 'styled-components';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { MouseEventHandler } from 'react';

interface DropdownHeaderProps {
  disabled?: boolean;
  expanded?: boolean;
  empty?: boolean;
  text?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const StyledDropdownHeader = styled.div<DropdownHeaderProps>`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 40px;
  outline: none;
  padding-left: 5px;
  outline: 1px solid;
  z-index: 2;
  border-radius: 4px;
  outline-color: ${(props) => props.theme.secondary.accent};
  background: ${(props) => props.theme.background};
  transition: 100ms;

  ${(props) => {
    if (props.disabled || !props.expanded) return;

    return css`
      outline-color: ${props.theme.primary.hover};
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    `;
  }}
`;

const StyledDropdownHeaderText = styled(Text)<DropdownHeaderProps>`
  color: ${(props) => props.empty ? props.theme.text.darker : props.theme.text.lighter};
`;

const StyledDropdownHeaderIcon = styled(Icon)<DropdownHeaderProps>`
  position: absolute;
  right: 10px;
  fill: ${(props) => props.theme.text.normal};
`;

const DropdownHeader: React.FC<DropdownHeaderProps> = (props: DropdownHeaderProps) => {
  return (
    <StyledDropdownHeader {...props}>
      <StyledDropdownHeaderText
        empty={props.empty}
        text={props.text}
      />
      <StyledDropdownHeaderIcon
        {...props}
        variant={props.expanded ? 'ChevronUp' : 'ChevronDown' }
      />
    </StyledDropdownHeader>
  );
};

DropdownHeader.defaultProps = {
  text: 'Option',
  expanded: false,
};

export { DropdownHeader };
