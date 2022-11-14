import React from 'react';
import styled from 'styled-components';
import { FlatButton } from '../../components/Buttons/FlatButton';
import { TIMELINE_OFFSET_X } from '../../constants';
import { useAppDispatch } from '../../hooks';
import { pushTrack } from '../../store/Reducers/timelineSlice';

const StyledTimelineRowAddButton = styled(FlatButton)`
  width: ${TIMELINE_OFFSET_X}px;
  height: 50px;
  cursor: pointer;
  background: ${(props) => props.theme.secondary.surface};
`;

const TimelineRowAddButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const onClick = () => dispatch(pushTrack());

  return (
    <StyledTimelineRowAddButton
      className='timeline-row-add'
      iconSize='Normal'
      iconType='Plus'
      showLabel={false}
      onClick={onClick}
    />
  );
};

export { TimelineRowAddButton };
