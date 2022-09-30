import styled from 'styled-components';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { ButtonGroup } from '../../components/Buttons/ButtonGroup';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { Label } from '../../components/Label';

const StyledTimelineTools = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  position: relative;
  padding: 5px 12px;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.other.primary};

  .timeline-time {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    color: ${(props) => props.theme.text.lighter};
  }
`;

const TimelineTools: React.FC = () => {
  return (
    <StyledTimelineTools>
      <ButtonGroup gap={6}>
        <SecondaryButton showLabel={false} iconType='Undo' />
        <SecondaryButton showLabel={false} iconType='Redo' />
        <SecondaryButton showLabel={false} iconType='Split' />
        <SecondaryButton showLabel={false} iconType='BringForward' />
        <SecondaryButton showLabel={false} iconType='SendBackward' />
        <SecondaryButton showLabel={false} iconType='Delete' />
      </ButtonGroup>


      <FlexContainer gap={5} padding={0} className='timeline-time'>
        <Label className='timeline-time-current' text='0:00.00' useColor={false} />
        <Label className='timeline-time-delimiter' text='/' useColor={false} />
        <Label className='timeline-time-duration' text='0:00.00' useColor={false} />
      </FlexContainer>

      <ButtonGroup gap={6}>
        <SecondaryButton showLabel={false} iconType='Snap' togglable />
        <SecondaryButton showLabel={false} iconType='Minus' />
        <SecondaryButton showLabel={false} iconType='Plus' />
        <SecondaryButton showLabel={false} iconType='Fit' />
      </ButtonGroup>
    </StyledTimelineTools>
  );
};

export { TimelineTools };
