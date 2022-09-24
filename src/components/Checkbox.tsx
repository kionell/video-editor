import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { Label } from './Label';
import { Icon } from './Icon';
import { 
  NORMAL_FONT_SIZE, 
  NORMAL_ICON_SIZE 
} from '../constants';

export interface CheckboxProps {
  disabled?: boolean;
  checked?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  listener?: () => void;
}

const StyledCheckboxWrapper = styled.div<CheckboxProps>`
  display: flex;
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

    & > * {
      width: 100%;
      height: 100%;
      fill: ${(props) => props.checked ? props.theme.primary.accent : 'transparent'};
    }
  }

  ${(props) => {
    if (props.disabled) return;

    const { theme, checked } = props;

    return css`
      cursor: pointer;

      &:hover {
        border-color: ${theme.input.normalHover};

        & > * > * {
          fill: ${checked ? theme.primary.accentHover : 'transparent'};
        }
      }
    `;
  }}
`;

const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const [checked, setChecked] = useState(props.checked);

  const checkboxRef = useRef<HTMLInputElement>(null);

  const onClickListener = () => !props.disabled && setChecked(!checked);

  useEffect(() => {
    if (!checkboxRef.current) return;

    checkboxRef.current.addEventListener('click', onClickListener);

    if (props.listener) {
      checkboxRef.current.addEventListener('click', props.listener);
    }

    return () => {
      checkboxRef.current?.removeEventListener('click', onClickListener);

      if (props.listener) {
        checkboxRef.current?.removeEventListener('click', props.listener);
      }
    };
  });

  return (
    <StyledCheckboxWrapper {...props}>
      <StyledCheckbox {...props} ref={checkboxRef} checked={checked}>
        <Icon useColor={false} size={NORMAL_ICON_SIZE} />
      </StyledCheckbox>
      <Label 
        visible={props.showLabel} 
        text={props.label} 
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
