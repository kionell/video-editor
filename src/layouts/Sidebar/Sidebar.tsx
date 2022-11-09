import { useRef } from 'react';
import styled from 'styled-components';
import { ButtonGroup } from '../../components/Buttons/ButtonGroup';
import { FlatButton } from '../../components/Buttons/FlatButton';
import { SidebarSubmenu } from './SidebarSubmenu';

interface SidebarProps {
  reversed?: boolean;
  className?: string;
}

const StyledSidebarWrapper = styled.div<SidebarProps>`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: ${(props) => props.reversed ? 'row-reverse' : 'row'};
`;

const StyledSidebar = styled.div<SidebarProps>`
  width: 70px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(props) => props.theme.container.primary};
`;

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const mediaButtonRef = useRef(null);
  const textButtonRef = useRef(null);
  const transitionsButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);

  return (
    <StyledSidebarWrapper>
      <StyledSidebar {...props}>
        <ButtonGroup direction='column'>
          <FlatButton
            label='Media'
            iconType='Media'
            ref={mediaButtonRef}
          />
          <FlatButton
            label='Text'
            iconType='Text'
            ref={textButtonRef}
          />
          <FlatButton
            label='Transitions'
            iconType='Transition'
            ref={transitionsButtonRef}
          />
          <FlatButton
            label='Settings'
            iconType='Settings'
            ref={settingsButtonRef}
          />
        </ButtonGroup>
      </StyledSidebar>

      <SidebarSubmenu {...props} />
    </StyledSidebarWrapper>
  );
};

export { Sidebar };
