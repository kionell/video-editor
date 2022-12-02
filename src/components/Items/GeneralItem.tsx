import styled from 'styled-components';
import { ForwardedRef, forwardRef, HTMLAttributes, MouseEventHandler, RefObject, useRef } from 'react';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { Text } from '../Text';
import { SMALL_FONT_SIZE } from '../../constants';
import { ImagePreview } from '../ImagePreview';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { UploadedFile } from '../../core/Files/UploadedFile';
import { formatDuration } from '../../core/Utils/Format';
import { convertUploadedFileToElement } from '../../core/Utils/Files';
import { removeFile } from '../../store/Reducers/FileSlice';
import { getFitZoomLevel } from '../../core/Utils/Timeline';
import { DraggableProps, useDraggable } from '../../hooks/useDraggable';
import { PositionEvent } from '../../core/Utils/Position';
import {
  pushElement,
  removeElementsByFile,
  setCurrentZoom,
} from '../../store/Reducers/TimelineSlice';

import {
  selectCurrentScroll,
  selectCurrentZoom,
  selectFiles,
  selectTotalTracks,
} from '../../store';

export interface GeneralItemProps extends HTMLAttributes<HTMLDivElement>, DraggableProps {
  previewElement?: HTMLElement;
  deletable?: boolean;
  addable?: boolean;
  showDuration?: boolean;
  duration?: number;
  showLabel?: boolean;
  label?: string;
  file?: UploadedFile;
  ref?: RefObject<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const StyledGeneralItemWrapper = styled.div`
  width: 144px;
  display: inline-flex;
  flex-direction: column;
  position: relative;
  gap: 5px;
  justify-content: center;
  align-items: center;

  .general-item__label {
    color: ${(props) => props.theme.text.normal};
  }

  &:hover .general-item__label {
    color: ${(props) => props.theme.text.lighter};
  }
`;

const StyledGeneralItem = styled.div<GeneralItemProps>`
  width: 144px;
  height: 81px;
  display: flex;
  padding: 5px;
  align-items: flex-end;
  border-radius: 6px;
  border: none;
  outline: 2px solid;
  outline-color: transparent;
  transition: outline-color 150ms;

  justify-content: ${(props) => {
    return props.file?.hasDuration || props.showDuration
      ? 'space-between'
      : 'flex-end';
  }};

  .general-item__buttons {
    display: flex;
    opacity: 0;
    transition: opacity 150ms;
  }

  &:hover {
    outline-color: ${(props) => props.theme.primary.hover};
    
    .general-item__buttons {
      opacity: 1;
    }
  }
`;

const StyledGeneralItemPreview = styled.div`
  width: 144px;
  height: 81px;
  position: absolute;
  overflow: hidden;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 6px;
`;

const StyledGeneralItemDuration = styled(Text)`
  padding: 2px 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 1;
`;

const StyledGeneralItemButtonWrapper = styled(FlexContainer)`
  z-index: 1;
`;

const StyledGeneralItemLabel = styled(Text)`
  width: 100%;
`;

export const GeneralItem = forwardRef<HTMLDivElement, GeneralItemProps>((
  props: HTMLAttributes<HTMLDivElement> & GeneralItemProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { deletable, addable, file, showLabel } = props;

  const itemRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const currentScroll = useAppSelector(selectCurrentScroll);
  const currentZoom = useAppSelector(selectCurrentZoom);
  const totalTracks = useAppSelector(selectTotalTracks);
  const files = useAppSelector(selectFiles);
  const dispatch = useAppDispatch();

  const label = file?.name ?? props.label;
  const showDuration = file?.hasDuration ?? props.showDuration;
  const duration = file?.duration ?? props.duration;

  const onAddClick = (event: PositionEvent) => {
    event.stopPropagation();

    if (!file) return;

    const element = convertUploadedFileToElement(file);

    if (!element) return;

    dispatch(pushElement({ element }));

    if (totalTracks === 0) {
      const defaultDurationMs = element.totalDurationMs * 2;
      const zoomLevel = getFitZoomLevel(
        defaultDurationMs,
        currentScroll.left,
        currentZoom.zoom,
      );

      dispatch(setCurrentZoom(zoomLevel));
    }
  };

  const onDeleteClick = (event: PositionEvent) => {
    event.stopPropagation();

    const targetFile = file ? files.find((f) => f.equals(file)) : null;

    if (!targetFile) return;

    dispatch(removeFile(targetFile));
    dispatch(removeElementsByFile({ file: targetFile }));
  };

  useDraggable(itemRef, props);

  return (
    <StyledGeneralItemWrapper {...props}>
      <StyledGeneralItem className='general-item' {...props} ref={itemRef}>
        <StyledGeneralItemDuration
          text={formatDuration(duration)}
          visible={showDuration}
          size={SMALL_FONT_SIZE}
        />

        <StyledGeneralItemPreview ref={ref}>
          <ImagePreview
            width={144}
            height={81}
            file={file}
          />
        </StyledGeneralItemPreview>

        <StyledGeneralItemButtonWrapper
          className='general-item__buttons'
          padding={0}
        >
          <PrimaryButton
            buttonRef={addButtonRef}
            onClick={onAddClick}
            onTouchStart={onAddClick}
            visible={addable}
            showLabel={false}
            iconType='Plus'
            iconSize='Small'
            width={25}
            height={25}
            paddingHorizontal={3}
            paddingVertical={3}
          />
          <SecondaryButton
            buttonRef={deleteButtonRef}
            onClick={onDeleteClick}
            onTouchStart={onDeleteClick}
            visible={deletable}
            showLabel={false}
            iconType='Delete'
            iconSize='Small'
            width={25}
            height={25}
            paddingHorizontal={3}
            paddingVertical={3}
          />
        </StyledGeneralItemButtonWrapper>
      </StyledGeneralItem>

      <StyledGeneralItemLabel
        className='general-item__label'
        visible={showLabel}
        text={label}
        size={SMALL_FONT_SIZE}
      />
    </StyledGeneralItemWrapper>
  );
});

GeneralItem.displayName = 'General Item';

GeneralItem.defaultProps = {
  deletable: true,
  addable: true,
  showDuration: false,
  duration: 0,
  showLabel: true,
  label: 'General Item',
};
