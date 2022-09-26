import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const StyledTimelineSeekerLine = styled.div`
  width: 2px;
  height: 100%;
  min-height: 300px;
  margin-top: -3px;
`;

const StyledTimelineSeekerWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  user-select: none;
  cursor: col-resize;

  & > * {
    pointer-events: none;
  }

  & > ${StyledTimelineSeekerLine} {
    background: ${(props) => props.theme.text.lighter};
  }

  & > * > svg {
    fill: ${(props) => props.theme.text.lighter};
  }

  & > ${StyledTimelineSeekerLine}.focused {
    background: ${(props) => props.theme.primary.accentHover};
  }

  & > .focused > svg {
    fill: ${(props) => props.theme.primary.accentHover};
  }
`;

const TimelineSeeker: React.FC = () => {
  const [selected, setSelected] = useState(false);
  const seekerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', (e: Event) => {
      if (!seekerRef.current) return;
      
      if (e.target !== seekerRef.current) {
        setSelected(false);
      }
    });
  }, []);

  return (
    <StyledTimelineSeekerWrapper ref={seekerRef} onMouseDown={() => setSelected(true)}>
      <Icon size={25} useColor={false} variant='Seeker' className={selected ? 'focused' : ''} />
      <StyledTimelineSeekerLine className={selected ? 'focused' : ''} />
    </StyledTimelineSeekerWrapper>
  );
};

export { TimelineSeeker };
