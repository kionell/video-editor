import styled from 'styled-components';
import { ScrollableContainer } from '../components/Containers/ScrollableContainer';
import { PreviewArea } from '../components/Preview/PreviewArea';
import { Timeline } from '../components/Timeline/Timeline';
import { ExportMenu } from '../layouts/ExportMenu';
import { MediaPanel } from '../layouts/MediaPanel';
import { SettingsPanel } from '../layouts/SettingsPanel';

const StyledMainPage = styled(ScrollableContainer)`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0px;
`;

const StyledTopPart = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  width: 100%;
  height: 100%; 
  display: flex; 
  flex-direction: row;
  background-color: ${(props) => props.theme.background};
`;

const StyledBottomPart = styled.div`
  width: 100%;
  flex-grow: 0;
  flex-basis: 0;
  display: flex; 
  flex-direction: column;
`;

export const MainPage: React.FC = () => {
  window.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  window.addEventListener('dragenter', (event) => {
    event.preventDefault();
  });

  return (
    <StyledMainPage>
      <StyledTopPart>
        <MediaPanel />
        <PreviewArea />
        <SettingsPanel />
      </StyledTopPart>

      <StyledBottomPart>
        <Timeline />
      </StyledBottomPart>

      <ExportMenu />
    </StyledMainPage>
  );
};
