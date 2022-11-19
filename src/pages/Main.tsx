import styled from 'styled-components';
import { ScrollableContainer } from '../components/Containers/ScrollableContainer';
import { Sidebar } from '../layouts/Sidebar/Sidebar';
import { Timeline } from '../layouts/Timeline/Timeline';

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
        <Sidebar />
      </StyledTopPart>

      <StyledBottomPart>
        <Timeline />
      </StyledBottomPart>
    </StyledMainPage>
  );
};
