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
  outline-color: ${(props) => props.theme.input.normal};
  background: ${(props) => props.theme.secondary.accent};
  color: ${(props) => props.empty ? props.theme.text.darker : props.theme.text.lighter};

  ${(props) => {
    if (props.disabled || !props.expanded) return;

    return css`
      outline-color: ${props.theme.primary.accentHover};
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    `;
  }}

  .expand-icon {
    position: absolute;
    right: 10px;
  }
`;

const DropdownHeader: React.FC<DropdownHeaderProps> = (props: DropdownHeaderProps) => {
  const { expanded, text } = props;

  return (
    <StyledDropdownHeader {...props}>
      <Text text={text} useColor={false} />
      <Icon 
        variant={expanded ? 'ChevronUp' : 'ChevronDown' }
        className='expand-icon'
      />
    </StyledDropdownHeader>
  );
};

DropdownHeader.defaultProps = {
  text: 'Option',
  expanded: false,
};

export { DropdownHeader };
