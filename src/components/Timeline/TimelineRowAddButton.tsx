import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { FlatButton } from '../Buttons/FlatButton';
import { TIMELINE_OFFSET_X } from '../../constants';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { pushTrack } from '../../store/Reducers/TimelineSlice';

const StyledTimelineRowAddButton = styled(FlatButton)`
  width: ${TIMELINE_OFFSET_X}px;
  height: 50px;
  cursor: pointer;
  background: ${(props) => props.theme.secondary.surface};

  &:hover {
    background: ${(props) => props.theme.secondary.hover};
  }
`;

const TimelineRowAddButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
  const onClick = () => dispatch(pushTrack());

  return (
    <StyledTimelineRowAddButton
      className='timeline-row-add'
      iconSize='Normal'
      iconType='Plus'
      showLabel={false}
      onClick={onClick}
      onMouseDown={stopPropagation}
      onDoubleClick={stopPropagation}
    />
  );
};

export { TimelineRowAddButton };
