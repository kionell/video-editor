import styled from 'styled-components';
import { ForwardedRef, forwardRef, HTMLAttributes, MouseEventHandler, Ref } from 'react';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { Label } from '../Label';
import { withDraggable } from '../../hoc';

export interface GeneralItemProps extends HTMLAttributes<HTMLDivElement> {
  deletable?: boolean;
  addable?: boolean;
  showDuration?: boolean;
  showLabel?: boolean;
  label?: string;
  ref?: Ref<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const StyledGeneralItemWrapper = styled.div`
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

const StyledGeneralItemPreview = styled.div<GeneralItemProps>`
  width: 160px;
  height: 90px;
  display: flex;
  padding: 0px 3px 3px 3px;
  align-items: flex-end;
  border-radius: 6px;
  background: white;
  border: none;
  outline: none;
  
  justify-content: ${(props) => {
    return props.showDuration ? 'space-between' : 'center';
  }};

  .buttons {
    visibility: hidden;
  }

  &:hover {
    outline: 2px solid;
    outline-color: ${(props) => props.theme.primary.accentHover};

    .buttons {
      visibility: visible;
    }
  }
`;

const StyledGeneralItemDuration = styled(Label)`
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
`;

const BaseGeneralItem = forwardRef<HTMLDivElement, GeneralItemProps>((
  props: HTMLAttributes<HTMLDivElement> & GeneralItemProps, 
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { deletable, addable, showDuration, showLabel, label } = props;
  
  return (
    <StyledGeneralItemWrapper {...props}>
      <StyledGeneralItemPreview {...props} ref={ref}>
        <StyledGeneralItemDuration 
          text='0:00' 
          visible={showDuration}
        />

        <FlexContainer padding={0}>
          <PrimaryButton
            className='buttons'
            visible={addable}
            showLabel={false}
            iconType='Plus'
            iconSize='Small'
          />
          <SecondaryButton
            className='buttons'
            visible={deletable}
            showLabel={false}
            iconType='Delete'
            iconSize='Small'
          />
        </FlexContainer>
      </StyledGeneralItemPreview>

      <Label
        className='labels'
        visible={showLabel} 
        text={label} 
        useColor={false} 
      />
    </StyledGeneralItemWrapper>
  );
});

BaseGeneralItem.displayName = 'General Item';

BaseGeneralItem.defaultProps = {
  deletable: true,
  addable: true,
  showDuration: true,
  showLabel: true,
  label: 'General Item',
};

export const GeneralItem: React.FC<GeneralItemProps> = (
  withDraggable(BaseGeneralItem) as React.FC<GeneralItemProps>
);
