import styled from 'styled-components';
import { createRef, useState, DragEvent } from 'react';
import { DragUploadOverlay } from '../layouts/Overlays/DragUploadOverlay';
import { Sidebar } from '../layouts/Sidebar/Sidebar';
import { Timeline } from '../layouts/Timeline/Timeline';

const StyledMainPage = styled.div`
  height: 100%;
  display: flex; 
  flex-direction: column; 
`;

export const Main: React.FC = () => {
  const [isDragAreaVisible, showDragArea] = useState(false);
  
  const dragRef = createRef<HTMLInputElement>();

  const onDragEnter = (event: DragEvent) => {
    event.stopPropagation();
    
    console.log('Enter!');

    showDragArea(true);
  };

  const onDragEnd = async (event: DragEvent) => {
    event.stopPropagation();

    console.log('End!');

    showDragArea(false);
  };

  return (
    <StyledMainPage 
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDrop={onDragEnd}
    >
      <DragUploadOverlay
        ref={dragRef}
        visible={isDragAreaVisible}
      />

      <div style={{
        height: '100%', 
        display: 'flex', 
        flexDirection: 'row' 
      }}>
        <Sidebar />
      </div>

      <Timeline />
    </StyledMainPage>
  );
};
