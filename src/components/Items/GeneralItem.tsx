import styled from 'styled-components';
import { ForwardedRef, forwardRef, HTMLAttributes, MouseEventHandler, Ref, useRef } from 'react';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { Label } from '../Label';
import { withDraggable } from '../../hoc';
import { SMALL_FONT_SIZE } from '../../constants';
import { formatTime } from '../../utils';
import { ImagePreview } from '../ImagePreview';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { UploadedFile } from '../../models/Files/UploadedFile';
import { removeFile } from '../../store/Reducers/fileSlice';

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
  padding: 0px 3px 3px 3px;
  align-items: flex-end;
  border-radius: 6px;
  border: none;
  outline: none;
  
  justify-content: ${(props) => {
    return props.showDuration ? 'space-between' : 'center';
  }};

  .button-wrapper {
    display: none;
  }

  &:hover {
    outline: 2px solid;
    outline-color: ${(props) => props.theme.primary.accentHover};

    .button-wrapper {
      display: flex;
    }
  }
`;

const StyledGeneralItemPreview = styled.div`
  width: 144px;
  height: 81px;
  position: absolute;
  border-radius: 6px;
  overflow: hidden;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const StyledGeneralItemDuration = styled(Label)`
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 1;
`;

const StyledGeneralItemButtonWrapper = styled(FlexContainer)`
  z-index: 1;
`;

const StyledGeneralItemLabel = styled(Label)`
  width: 100%;
`;

const BaseGeneralItem = forwardRef<HTMLDivElement, GeneralItemProps>((
  props: HTMLAttributes<HTMLDivElement> & GeneralItemProps, 
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { deletable, addable, file, showLabel } = props;

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const files = useAppSelector((state) => state.files);
  const dispatch = useAppDispatch();

  const label = file?.name ?? props.label;
  const showDuration = file?.hasDuration ?? props.showDuration;
  const duration = file?.duration ?? props.duration;
  const previewElement = file?.element;

  const onDeleteClick = () => {
    const targetFile = file ? files.list.find((f) => f.equals(file)) : null;

    if (targetFile) dispatch(removeFile(targetFile));
  };

  return (
    <StyledGeneralItemWrapper {...props}>
      <StyledGeneralItem {...props}>
        <StyledGeneralItemDuration 
          text={formatTime(duration)} 
          visible={showDuration}
          size={SMALL_FONT_SIZE}
        />

        <StyledGeneralItemPreview ref={ref}>
          <ImagePreview
            width={144}
            height={81}
            previewElement={previewElement} 
          />
        </StyledGeneralItemPreview>

        <StyledGeneralItemButtonWrapper
          className='button-wrapper'
          padding={0}
        >
          <PrimaryButton
            ref={addButtonRef}
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
      </StyledGeneralItem>

      <StyledGeneralItemLabel
        className='labels'
        visible={showLabel} 
        text={label} 
        useColor={false} 
        size={SMALL_FONT_SIZE}
      />
    </StyledGeneralItemWrapper>
  );
});

BaseGeneralItem.displayName = 'General Item';

BaseGeneralItem.defaultProps = {
  deletable: true,
  addable: true,
  showDuration: false,
  duration: 0,
  showLabel: true,
  label: 'General Item',
};

export const GeneralItem = withDraggable(BaseGeneralItem);
