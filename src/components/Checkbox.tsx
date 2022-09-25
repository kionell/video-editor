import styled, { css } from 'styled-components';
import { MouseEventHandler, useState, useRef } from 'react';
import { useUpdateEffect } from '../../hooks';
import { Label } from '../Label';
import { Icon } from '../Icon';
import { 
  NORMAL_FONT_SIZE, 
  NORMAL_ICON_SIZE 
} from '../../constants';

export interface CheckboxProps {
  disabled?: boolean;
  checked?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  onClick?: MouseEventHandler<HTMLInputElement>;
}

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckboxWrapper = styled.div<CheckboxProps>`
  display: inline-flex;
  justify-content: left;
  align-items: center;
  position: relative;
  margin: 12px;
  gap: 5px;

  flex-direction: ${(props) => props.labelPosition === 'left' ? 'row-reverse' : 'row'};
  opacity: ${(props) => props.disabled ? 0.25 : 1};
`;

const StyledCheckbox = styled.div<CheckboxProps>`
  position: relative;
  top: 0px;
  left: 0px;
  height: ${NORMAL_ICON_SIZE}px;
  width: ${NORMAL_ICON_SIZE}px;
  background: transparent;
  border: 1px solid;
  border-radius: 3px;
  border-color: ${(props) => props.theme.input.normal};

  & > * {
    width: 100%;
    height: 100%;
    visibility: ${(props) => props.checked ? 'visible' : 'hidden'};

    & > * {
      width: 100%;
      height: 100%;
      fill: ${(props) => props.theme.primary.accent};
    }
  }

  ${(props) => {
    if (props.disabled) return;

    return css`
      cursor: pointer;

      &:hover {
        border-color: ${props.theme.input.normalHover};
        fill: ${props.theme.primary.accentHover};
      }
    `;
  }}
`;

const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const { showLabel, label, labelPosition, disabled, onClick } = props;
  
  const [checked, setChecked] = useState(props.checked);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useUpdateEffect(() => checkboxRef.current?.click(), [checked]);

  const changeState = () => !disabled && setChecked(!checked);

  return (
    <StyledCheckboxWrapper
      labelPosition={labelPosition}
      disabled={disabled}
      onClick={changeState}
    >
      <HiddenCheckbox 
        disabled={disabled} 
        checked={checked} 
        onClick={onClick}
        onChange={() => void 0}
        ref={checkboxRef}
      />
      <StyledCheckbox disabled={disabled} checked={checked}>
        <Icon useColor={false} size={NORMAL_ICON_SIZE} />
      </StyledCheckbox>
      <Label 
        visible={showLabel} 
        text={label} 
        size={NORMAL_FONT_SIZE}
      />
    </StyledCheckboxWrapper>
  );
};

Checkbox.defaultProps = {
  disabled: false,
  checked: false,
  showLabel: true,
  label: 'Checkbox',
  labelPosition: 'right',
};

export { Checkbox };
