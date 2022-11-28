import etro from 'etro';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FlatButton } from '../Buttons/FlatButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { VideoPlayer } from '../../core/VideoPlayer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useTimelineUpdate } from '../../hooks/useTimelineUpdate';
import { setCurrentTimeMs } from '../../store/Reducers/TimelineSlice';
import { setPlaying } from '../../store/Reducers/PreviewSlice';
import {
  DEFAULT_SCALED_PREVIEW_HEIGHT,
  DEFAULT_SCALED_PREVIEW_WIDTH,
} from '../../constants';

const StyledPlayerArea = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  padding: 0px;
  gap: 0px;
  justify-content: center;
  align-content: center;
  overflow: hidden;
`;

const StyledPlayerWrapper = styled(FlexContainer)`
  padding: 0px;
  gap: 12px;
  flex-direction: column;
`;

const StyledPlayer = styled.canvas`
  background: black;
`;

const StyledPlayerButtonWrapper = styled(FlexContainer)`
  padding: 0px;
  gap: 15px;
  align-self: center;
`;

const StyledPlayerButton = styled(FlatButton)`
  width: 40px;
  height: 40px;
  padding: 0px;
`;

const Player: React.FC = () => {
  const dispatch = useAppDispatch();
  const timeline = useAppSelector((state) => state.timeline);
  const preview = useAppSelector((state) => state.preview);

  const playPromise = useRef<Promise<void>>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<VideoPlayer>();

  const subscribeToEvents = () => {
    if (!playerRef.current) return;

    const subscribe = etro.event.subscribe;
    const movie = playerRef.current.movie;

    subscribe(movie, 'movie.play', () => {
      dispatch(setPlaying(!movie.paused));
    });

    subscribe(movie, 'movie.pause', () => {
      dispatch(setPlaying(!movie.paused));
    });

    subscribe(movie, 'movie.ended', () => {
      dispatch(setPlaying(false));
    });

    subscribe(movie, 'movie.timeupdate', () => {
      dispatch(setCurrentTimeMs(movie.currentTime * 1000));
    });
  };

  const checkOrCreatePlayer = () => {
    if (playerRef.current) return;

    playerRef.current = new VideoPlayer({
      canvas: canvasRef.current,
      autoRefresh: false,
    });

    subscribeToEvents();

    playerRef.current.syncWithTimeline(timeline);
  };

  const play = () => {
    if (!canvasRef.current || playPromise.current) return;

    checkOrCreatePlayer();

    if (!playerRef.current.movie.rendering) {
      if (playerRef.current.ended && timeline.ended) {
        playerRef.current.currentTime = 0;
      }

      playPromise.current = playerRef.current.play();

      playPromise.current.then(() => {
        playPromise.current = null;
      });
    }
  };

  const pause = () => {
    if (!canvasRef.current || !playerRef.current) return;

    if (playerRef.current.movie.rendering) {
      playerRef.current.pause();
    }
  };

  useTimelineUpdate(() => {
    checkOrCreatePlayer();

    playerRef.current.syncWithTimeline(timeline);
  });

  useEffect(() => {
    checkOrCreatePlayer();

    const seekTime = timeline.lastSeekTimeMs / 1000;

    if (playerRef.current.currentTime !== seekTime) {
      playerRef.current.pause();
      playerRef.current.currentTime = seekTime;
    }
  }, [timeline.lastSeekTimeMs]);

  return (
    <StyledPlayerArea className='player-area'>
      <StyledPlayerWrapper className='player-wrapper'>
        <StyledPlayer
          className='player-canvas'
          width={DEFAULT_SCALED_PREVIEW_WIDTH}
          height={DEFAULT_SCALED_PREVIEW_HEIGHT}
          ref={canvasRef}
        />

        <StyledPlayerButtonWrapper className='player-buttons'>
          <StyledPlayerButton
            iconType='Backward'
            showLabel={false}
          />
          <StyledPlayerButton
            onClick={preview.isPlaying ? pause : play}
            iconType={preview.isPlaying ? 'Pause' : 'Play'}
            showLabel={false}
          />
          <StyledPlayerButton
            iconType='Forward'
            showLabel={false}
          />
        </StyledPlayerButtonWrapper>
      </StyledPlayerWrapper>
    </StyledPlayerArea>
  );
};

export { Player };
