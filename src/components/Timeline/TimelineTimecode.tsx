import styled from 'styled-components';
import { FlexContainer } from '../Containers/FlexContainer';
import { Text } from '../Text';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { formatTimeMs } from '../../core/Utils/Format';

const StyledTimecodeContainer = styled(FlexContainer)`
  position: relative;
  padding: 0px;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
`;

const StyledTimecodeLabel = styled(Text)`
  color: ${(props) => props.theme.text.lighter};
`;

const TimelineTimecode: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);

  const currentTimeRef = useRef<HTMLLabelElement>(null);
  const durationRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (!currentTimeRef.current) return;

    currentTimeRef.current.innerText = formatTimeMs(timeline.currentTimeMs);
  }, [timeline.currentTimeMs]);

  useEffect(() => {
    if (!durationRef.current) return;

    durationRef.current.innerText = formatTimeMs(timeline.totalLengthMs);
  }, [timeline.totalLengthMs]);

  return (
    <StyledTimecodeContainer>
      <StyledTimecodeLabel
        text={formatTimeMs()}
        ref={currentTimeRef}
      />
      <StyledTimecodeLabel text='/' />
      <StyledTimecodeLabel
        text={formatTimeMs()}
        ref={durationRef}
      />
    </StyledTimecodeContainer>
  );
};

export { TimelineTimecode };
