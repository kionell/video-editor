import styled from 'styled-components';
import { createRef } from 'react';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { GeneralItem } from '../Items/GeneralItem';
import { UploadItem } from '../Items/UploadItem';
import { useAppSelector } from '../../hooks/useAppSelector';

const StyledMediaCategory = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;
  overflow-y: auto;
`;

const MediaCategory: React.FC = () => {
  const files = useAppSelector((state) => state.files);

  return (
    <StyledMediaCategory>
      <ScrollableContainer
        gap={20}
        padding={20}
        align='start'
      >
        <UploadItem />
        {
          files.list.map((file, index) => {
            return <GeneralItem
              file={file}
              key={index}
              ref={createRef()}
            />;
          })
        }
      </ScrollableContainer>
    </StyledMediaCategory>
  );
};

export { MediaCategory };
