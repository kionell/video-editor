import styled from 'styled-components';
import { FlexContainer } from '../Containers/FlexContainer';
import { Player } from './Player';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectTotalLengthMs } from '../../store';
import { setExportMenuVisible } from '../../store/Reducers/GeneralSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useEffect, useRef } from 'react';
import { clamp } from '../../core/Utils/Math';

const StyledPreviewArea = styled(FlexContainer)`
  width: 100%;
  min-width: 200px;
  height: 100%;
  padding: 0px;
  gap: 0px;
  justify-content: center;
  align-content: center;
  overflow: hidden;
`;

const StyledExportButton = styled(PrimaryButton)`
  width: 100px;
  height: 35px;
  position: absolute;
  right: 20px;
  top: 20px;
`;

const PreviewArea: React.FC = () => {
  const dispatch = useAppDispatch();
  const totalLengthMs = useAppSelector(selectTotalLengthMs);

  const previewAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onExportClick = () => dispatch(setExportMenuVisible(true));

  const onPlayerResize = (rect: DOMRectReadOnly) => {
    const areaWidth = rect.width;
    const areaHeight = rect.height;

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    const canvasMaxWidth = areaWidth * 0.8;
    const canvasWidthRatio = canvasWidth / canvasMaxWidth;

    const canvasMaxHeight = areaHeight * 0.8;
    const canvasHeightRatio = canvasHeight / canvasMaxHeight;

    const canvasRatioWidth = canvasWidth / canvasHeightRatio;
    const canvasRatioHeight = canvasHeight / canvasWidthRatio;

    const scaledWidth = clamp(canvasRatioWidth, 0, canvasMaxWidth);
    const scaledHeight = clamp(canvasRatioHeight, 0, canvasMaxHeight);

    canvasRef.current.style.width = scaledWidth + 'px';
    canvasRef.current.style.height = scaledHeight + 'px';
  };

  useEffect(() => {
    if (!previewAreaRef.current || !canvasRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== previewAreaRef.current) return;

        onPlayerResize(entry.contentRect);
      }
    });

    resizeObserver.observe(previewAreaRef.current);

    return () => {
      resizeObserver.unobserve(previewAreaRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <StyledPreviewArea className='preview-area' ref={previewAreaRef}>
      <Player canvasRef={canvasRef} />

      <StyledExportButton
        label='Export'
        iconType='Export'
        disabled={totalLengthMs <= 0}
        onClick={onExportClick}
        showLabel
      />
    </StyledPreviewArea>
  );
};

export { PreviewArea };
