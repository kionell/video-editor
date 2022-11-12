import styled from 'styled-components';
import { ForwardedRef, forwardRef, HTMLAttributes, MouseEventHandler, Ref, useRef } from 'react';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { Text } from '../Text';
import { withDraggable } from '../../hoc';
import { SMALL_FONT_SIZE } from '../../constants';
import { formatDuration } from '../../utils/format';
import { ImagePreview } from '../ImagePreview';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { UploadedFile } from '../../models/Files/UploadedFile';
import { removeFile } from '../../store/Reducers/fileSlice';
import { addElement } from '../../store/Reducers/timelineSlice';
import { convertUploadedFileToElement } from '../../utils/files';

export interface GeneralItemProps extends HTMLAttributes<HTMLDivElement> {
  previewElement?: HTMLElement;
  deletable?: boolean;
  addable?: boolean;
  showDuration?: boolean;
  duration?: number;
  showLabel?: boolean;
  label?: string;
  file?: UploadedFile;
  ref?: Ref<HTMLDivElement>;
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

  .labels {
    color: ${(props) => props.theme.text.normal};
  }

  &:hover .labels {
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
  
  justify-content: ${(props) => {
    return props.file?.hasDuration || props.showDuration
      ? 'space-between'
      : 'flex-end';
  }};

  .button-wrapper {
    display: flex;
    opacity: 0;
    transition: opacity 150ms;
  }

  &:hover {
    .button-wrapper {
      opacity: 1;
    }
  }
`;

const DraggableGeneralItem = withDraggable(StyledGeneralItem);

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
  border: 2px solid;
  border-color: transparent;
  transition: border-color 150ms;
  
  &:hover {
    border-color: ${(props) => props.theme.primary.hover};
  }
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

  const files = useAppSelector((state) => state.files);
  const dispatch = useAppDispatch();

  const label = file?.name ?? props.label;
  const showDuration = file?.hasDuration ?? props.showDuration;
  const duration = file?.duration ?? props.duration;

  const onAddClick = () => {
    if (!file) return;

    const element = convertUploadedFileToElement(file);

    if (!element) return;

    dispatch(addElement({ element }));
  };

  const onDeleteClick = () => {
    const targetFile = file ? files.list.find((f) => f.equals(file)) : null;

    if (targetFile) dispatch(removeFile(targetFile));
  };

  return (
    <StyledGeneralItemWrapper {...props}>
      <DraggableGeneralItem {...props} ref={itemRef}>
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
          className='button-wrapper'
          padding={0}
        >
          <PrimaryButton
            ref={addButtonRef}
            onClick={onAddClick}
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
            ref={deleteButtonRef}
            onClick={onDeleteClick}
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
      </DraggableGeneralItem>

      <StyledGeneralItemLabel
        className='labels'
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
