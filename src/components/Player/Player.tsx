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
import { PrimaryButton } from '../Buttons/PrimaryButton';
import {
  DEFAULT_SCALED_PREVIEW_HEIGHT,
  DEFAULT_SCALED_PREVIEW_WIDTH,
} from '../../constants';
import {
  selectIsEnded,
  selectIsPlaying,
  selectLastSeekTimeMs,
  selectTracks,
} from '../../store';

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
  height: 80%;
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

const ExportButton = styled(PrimaryButton)`
  position: absolute;
  right: 30px;
  top: 15px;
`;

const Player: React.FC = () => {
  const dispatch = useAppDispatch();

  const lastSeekTimeMs = useAppSelector(selectLastSeekTimeMs);
  const ended = useAppSelector(selectIsEnded);
  const tracks = useAppSelector(selectTracks);
  const isPlaying = useAppSelector(selectIsPlaying);

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

    playerRef.current.syncWithTimeline(tracks);
  };

  const play = () => {
    if (!canvasRef.current || playPromise.current) return;

    checkOrCreatePlayer();

    if (!playerRef.current.movie.rendering) {
      if (playerRef.current.ended && ended) {
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

    playerRef.current.syncWithTimeline(tracks);
  });

  useEffect(() => {
    checkOrCreatePlayer();

    const seekTime = lastSeekTimeMs / 1000;

    if (playerRef.current.currentTime !== seekTime) {
      playerRef.current.pause();
      playerRef.current.currentTime = seekTime;
    }
  }, [lastSeekTimeMs]);

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
            onClick={isPlaying ? pause : play}
            iconType={isPlaying ? 'Pause' : 'Play'}
            showLabel={false}
          />
          <StyledPlayerButton
            iconType='Forward'
            showLabel={false}
          />
        </StyledPlayerButtonWrapper>
      </StyledPlayerWrapper>

      <ExportButton
        showLabel
        label='Export'
        iconType='Export'
      />
    </StyledPlayerArea>
  );
};

export { Player };
