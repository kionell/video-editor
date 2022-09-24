import styled from 'styled-components';
import { ButtonProps, StyledBaseButton } from './Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
import { 
  LARGE_ICON_SIZE, 
  NORMAL_FONT_SIZE, 
  NORMAL_ICON_SIZE 
} from '../../constants';

interface SecondaryButtonProps extends ButtonProps {
  largeIcon?: boolean;
  togglable?: boolean;
}

const StyledSecondaryButton = styled(StyledBaseButton)`
  width: 85px;
  height: 30px;

  background: ${(props) => props.theme.secondary.normal};
  
  &:hover:enabled {
    background: ${(props) => props.theme.secondary.normalHover};
  }
`;

const SecondaryButton: React.FC<SecondaryButtonProps> = (props: SecondaryButtonProps) => {
  const { showIcon, iconType, largeIcon, showLabel, label } = props;

  return (
    <StyledSecondaryButton {...props}>
      <Icon 
        visible={showIcon} 
        variant={iconType} 
        size={largeIcon ? LARGE_ICON_SIZE : NORMAL_ICON_SIZE}
        useColor={false}
      />
      <Label 
        visible={showLabel} 
        text={label} 
        size={NORMAL_FONT_SIZE}
        useColor={false}
      />
    </StyledSecondaryButton>
  );
};

SecondaryButton.defaultProps = {
  disabled: false,
  showIcon: true,
  largeIcon: false,
  showLabel: true,
  label: 'Button',
};

export { SecondaryButton };
