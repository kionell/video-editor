import styled, { css } from 'styled-components';

type ResizerDirection = 'left' | 'top' | 'right' | 'bottom';

export interface ResizerProps {
  direction: ResizerDirection;
}

const StyledResizerArea = styled.div<ResizerProps>`
  z-index: 10;
  position: absolute;
  transform: ${({ direction }) => {
    switch (direction) {
      case 'top': return 'translateY(-100%)';
      case 'right': return 'translateX(100%)';
      case 'bottom': return 'translateY(100%)';
      case 'left': return 'translateX(-100%)';
    }
  }};

  padding: ${({ direction }) => {
    switch (direction) {
      case 'top': return '10px 0px 0px 0px';
      case 'right': return '0px 10px 0px 0px';
      case 'bottom': return '0px 0px 10px 0px';
      case 'left': return '0px 0px 0px 10px';
    }
  }};

  cursor: ${({ direction }) => {
    switch (direction) {
      case 'right':
      case 'left': return 'col-resize';
    }

    return 'row-resize';
  }};

  width: ${({ direction }) => {
    switch (direction) {
      case 'right':
      case 'left': return '13px';
    }

    return '100%';
  }};

  height: ${({ direction }) => {
    switch (direction) {
      case 'top':
      case 'bottom': return '13px';
    }

    return '100%';
  }};

  ${({ direction }) => {
    switch (direction) {
      case 'top': return css`top: 0px;`;
      case 'right': return css`right: 0px;`;
      case 'bottom': return css`bottom: 0px;`;
      case 'left': return css`left: 0px;`;
    }
  }}

  &:hover {
    .resizer-line {
      background-color: ${(props) => props.theme.primary.accent};
    }
  }

  &:active {
    .resizer-line {
      background-color: ${(props) => props.theme.primary.press};
    }
  }
`;

const StyledResizerLine = styled.div<ResizerProps>`
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: transparent;
  transition: background-color 150ms;
`;

const ResizerLine: React.FC<ResizerProps> = (props: ResizerProps) => {
  return (
    <StyledResizerArea {...props} className={`resizer-${props.direction}`}>
      <StyledResizerLine {...props} className='resizer-line' />
    </StyledResizerArea>
  );
};

export { ResizerLine };
