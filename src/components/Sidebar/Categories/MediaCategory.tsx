import styled from 'styled-components';
import { createRef, PropsWithChildren } from 'react';
import { ScrollableContainer } from '../../Containers/ScrollableContainer';
import { GeneralItem } from '../../Items/GeneralItem';
import { UploadItem } from '../../Items/UploadItem';
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
      <ScrollableContainer
        {...props}
        gap={16}
        padding={16}
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
    </StyledSidebarMediaCategory>
  );
};

export { MediaCategory };
