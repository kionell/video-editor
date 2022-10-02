import styled from 'styled-components';
import { createRef, PropsWithChildren } from 'react';
import { ScrollableContainer } from '../../../components/Containers/ScrollableContainer';
import { GeneralItem } from '../../../components/Items/GeneralItem';
import { UploadItem } from '../../../components/Items/UploadItem';
import { useAppSelector } from '../../../hooks/useAppSelector';

interface SidebarCategoryProps extends PropsWithChildren {
  className?: string;
}

const StyledSidebarMediaCategory = styled.div<SidebarCategoryProps>`
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

const MediaCategory: React.FC<SidebarCategoryProps> = (props: SidebarCategoryProps) => {
  const files = useAppSelector((state) => state.files);
  
  return (
    <StyledSidebarMediaCategory>
      <ScrollableContainer {...props} gap={12} padding={12} align='start' justify='space-between'>
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
    </StyledSidebarMediaCategory>
  );
};

export { MediaCategory };
