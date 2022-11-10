import styled from 'styled-components';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { Text } from '../../components/Text';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { formatTimeMs } from '../../utils/format';

const StyledTimeContainer = styled(FlexContainer)`
  position: relative;
  padding: 0px;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
`;

const StyledTimeLabel = styled(Text)`
  color: ${(props) => props.theme.text.lighter};
`;

const TimelineTime: React.FC = () => {
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
    <StyledTimeContainer>
      <StyledTimeLabel
        text={formatTimeMs()}
        ref={currentTimeRef}
      />
      <StyledTimeLabel text='/' />
      <StyledTimeLabel
        text={formatTimeMs()}
        ref={durationRef}
      />
    </StyledTimeContainer>
  );
};

export { TimelineTime };
