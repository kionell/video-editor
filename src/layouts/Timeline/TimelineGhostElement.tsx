import styled from 'styled-components';

const StyledGhostElementWrapper = styled.div`
  position: absolute;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  border: 2px dashed ${(props) => props.theme.primary.accent};
  border-radius: 6px;
  overflow: hidden;
  background-color: ${(props) => props.theme.primary.accent + '30'};
`;

const TimelineGhostElement: React.FC = () => {
  return <StyledGhostElementWrapper />;
};

export { TimelineGhostElement };
