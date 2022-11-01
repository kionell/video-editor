import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledTimelineTrack = styled.div`
  width: 100%;
  height: 50px;
  left: 100px;
  display: flex;
  border: none;
  overflow: hidden;
  background: ${(props) => props.theme.other.secondary};
`;

const TimelineTrack: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
  return (
    <StyledTimelineTrack></StyledTimelineTrack>
  );
};

export { TimelineTrack };