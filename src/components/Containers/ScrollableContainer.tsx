import Scrollbars from 'react-custom-scrollbars-2';
import styled from 'styled-components';
import { FlexProps, FlexContainer } from './FlexContainer';

// Hide scrollbars for Google Chrome
const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: 100%;
  
  & > *::-webkit-scrollbar {
    display: none;
  }

  & > * {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    margin: 0 !important; /* Overwrites negative margin from scrollbar lib */
  }
`;

const ScrollableContainer: React.FC<FlexProps> = (props: FlexProps) => {
  return (
    <StyledScrollbars hideTracksWhenNotNeeded autoHide >
      <FlexContainer {...props} />
    </StyledScrollbars>
  );
};

export { ScrollableContainer };
