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
  height: 100%; 
  display: flex; 
  flex-direction: row;
  background-color: ${(props) => props.theme.other.background};
`;

const StyledBottomPart = styled.div`
  flex-grow: 0;
  flex-basis: 0;
  display: flex; 
  flex-direction: column;
`;

export const Main: React.FC = () => {
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
