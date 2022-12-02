import styled from 'styled-components';
import { ButtonProps } from '../Buttons/Button';
import { SecondaryButton } from '../Buttons/SecondaryButton';

const StyledTimelineButton = styled(SecondaryButton)`
  width: 42px;
  height: 35px;

  label {
    display: none;
  }
`;

const TimelineButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return <StyledTimelineButton { ...props } />;
};

export { TimelineButton };
