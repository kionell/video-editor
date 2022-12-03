import etro from 'etro';
import styled from 'styled-components';
import { RefObject, useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FlatButton } from '../Buttons/FlatButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { VideoPlayer } from '../../core/Render/VideoPlayer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useTimelineUpdate } from '../../hooks/useTimelineUpdate';
import { setCurrentTimeMs, setLastSeekTimeMs } from '../../store/Reducers/TimelineSlice';
import { setPlaying } from '../../store/Reducers/PreviewSlice';
import {
  DEFAULT_SCALED_PREVIEW_HEIGHT,
  DEFAULT_SCALED_PREVIEW_WIDTH,
} from '../../constants';
import {
  selectIsEnded,
  selectIsPlaying,
  selectLastSeekTimeMs,
  selectTotalLengthMs,
  selectTracks,
} from '../../store';

interface PlayerProps {
  canvasRef?: RefObject<HTMLCanvasElement>;
}

const StyledPlayerWrapper = styled(FlexContainer)`
  padding: 0px;
  gap: 12px;
  flex-direction: column;
`;

const StyledPlayerCanvas = styled.canvas`
  background: black;
`;

const StyledPlayerButtonWrapper = styled(FlexContainer)`
  padding: 0px;
  gap: 15px;
  align-self: center;
`;

const StyledPlayerButton = styled(FlatButton)`
  width: 35px;
  height: 35px;
  padding: 0px;
`;

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const dispatch = useAppDispatch();

  const lastSeekTimeMs = useAppSelector(selectLastSeekTimeMs);
  const totalLengthMs = useAppSelector(selectTotalLengthMs);
  const ended = useAppSelector(selectIsEnded);
  const tracks = useAppSelector(selectTracks);
  const isPlaying = useAppSelector(selectIsPlaying);

  const canvasRef = props.canvasRef ?? useRef<HTMLCanvasElement>(null);
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

    subscribe(movie, 'movie.seek', () => {
      dispatch(setLastSeekTimeMs(movie.currentTime * 1000));
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
    if (!canvasRef.current) return;

    checkOrCreatePlayer();

    if (!playerRef.current.movie.rendering) {
      if (playerRef.current.ended && ended) {
        playerRef.current.currentTime = 0;
      }

      playerRef.current.play();
    }
  };

  const pause = () => {
    if (!canvasRef.current || !playerRef.current) return;

    if (playerRef.current.movie.rendering) {
      playerRef.current.pause();
    }
  };

  const seekToStart = () => {
    checkOrCreatePlayer();

    playerRef.current.currentTime = 0;
  };

  const seekToEnd = () => {
    checkOrCreatePlayer();

    playerRef.current.currentTime = totalLengthMs;
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
    <StyledPlayerWrapper className='preview-player-wrapper'>
      <StyledPlayerCanvas
        className='preview-player-canvas'
        width={DEFAULT_SCALED_PREVIEW_WIDTH}
        height={DEFAULT_SCALED_PREVIEW_HEIGHT}
        ref={canvasRef}
      />

      <StyledPlayerButtonWrapper className='preview-player-buttons'>
        <StyledPlayerButton
          className='preview-player-buttons__backwards'
          iconType='Backward'
          showLabel={false}
          onClick={seekToStart}
        />
        <StyledPlayerButton
          className='preview-player-buttons__play'
          iconType={isPlaying ? 'Pause' : 'Play'}
          showLabel={false}
          onClick={isPlaying ? pause : play}
        />
        <StyledPlayerButton
          className='preview-player-buttons__forward'
          iconType='Forward'
          showLabel={false}
          onClick={seekToEnd}
        />
      </StyledPlayerButtonWrapper>
    </StyledPlayerWrapper>
  );
};

export { Player };
