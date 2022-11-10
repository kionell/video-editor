import styled, { css } from 'styled-components';
import { useRef, useState } from 'react';
import { Text } from '../Text';
import { Icon } from '../Icon';
import {
  NORMAL_FONT_SIZE,
  NORMAL_ICON_SIZE,
} from '../../constants';

export interface CheckboxProps {
  disabled?: boolean;
  checked?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
}

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  outline: none;
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

  flex-direction: ${(props) => {
    return props.labelPosition === 'left' ? 'row-reverse' : 'row';
  }};

  opacity: ${(props) => props.disabled ? 0.25 : 1};

  ${(props) => {
    if (props.disabled) return;

    return css<CheckboxProps>`
      cursor: pointer;

      &:hover > ${StyledCheckbox} {
        fill: ${props.theme.primary.hover};
        outline-color: ${({ checked, theme }) => {
          return checked ? theme.primary.hover : theme.secondary.hover;
        }};
      }
    `;
  }}
`;

const StyledCheckbox = styled.div<CheckboxProps>`
  position: relative;
  top: 0px;
  left: 0px;
  height: ${NORMAL_ICON_SIZE}px;
  width: ${NORMAL_ICON_SIZE}px;
  background: transparent;
  outline: 1px solid;
  border-radius: 3px;
  transition: 100ms;
  fill: ${(props) => props.theme.primary.accent};
  outline-color: ${({ checked, theme }) => {
    return checked ? theme.primary.accent : theme.secondary.accent;
  }};
`;

const StyledCheckboxIcon = styled(Icon)<CheckboxProps>`
  width: 100%;
  height: 100%;
  visibility: ${(props) => props.checked ? 'visible' : 'hidden'};
`;

const StyledCheckboxLabel = styled(Text)`
  color: ${(props) => props.theme.text.normal};
`;

const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const { showLabel, label, labelPosition, disabled } = props;

  const [checked, setChecked] = useState(props.checked);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const changeState = () => {
    if (disabled) return;

    setChecked(!checked);

    // checkboxRef.current?.dispatchEvent(new Event('change'));
  };

  // useUpdateEffect(() => {
  //   if (props.onChange) {
  //     checkboxRef.current?.addEventListener('change', props.onChange);
  //   }

  //   return () => {
  //     if (props.onChange) {
  //       checkboxRef.current?.removeEventListener('change', props.onChange);
  //     }
  //   };
  // }, []);

  return (
    <StyledCheckboxWrapper
      labelPosition={labelPosition}
      disabled={disabled}
      checked={checked}
      onClick={changeState}
    >
      <HiddenCheckbox
        ref={checkboxRef}
        disabled={disabled}
        checked={checked}
        readOnly
      />
      <StyledCheckbox checked={checked}>
        <StyledCheckboxIcon
          checked={checked}
          size={NORMAL_ICON_SIZE}
        />
      </StyledCheckbox>
      <StyledCheckboxLabel
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
  labelPosition: 'left',
};

export { Checkbox };
