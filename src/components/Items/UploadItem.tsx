import styled from 'styled-components';
import { Label } from '../Label';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { FileInput } from '../Inputs/FileInput';

const StyledUploadItemWrapper = styled.div`
  width: 144px;
  height: 81px;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  overflow: hidden;
  border: 2px dashed ${(props) => props.theme.text.normal};

  .message-icons {
    fill: ${(props) => props.theme.text.normal};
  }

  .message-labels {
    color: ${(props) => props.theme.text.normal};
  }

  &:hover {
    background: ${(props) => props.theme.text.darker};
    border: 2px dashed ${(props) => props.theme.text.lighter};

    .message-icons {
      fill: ${(props) => props.theme.text.lighter};
    }

    .message-labels {
      color: ${(props) => props.theme.text.lighter};
    }
  }
`;

const StyledUploadMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
`;

const UploadItem: React.FC = () => {
  return (
    <StyledUploadItemWrapper>
      <StyledUploadMessageWrapper>
        <Icon 
          className='message-icons'
          size={getIconSizeBySizeType('Large')}
          variant='Plus'
          useColor={false}
        />
        <Label
          className='message-labels'
          text='Add media' 
          useColor={false} 
        />
      </StyledUploadMessageWrapper>
      <FileInput />
    </StyledUploadItemWrapper>
  );
};

export { UploadItem };
