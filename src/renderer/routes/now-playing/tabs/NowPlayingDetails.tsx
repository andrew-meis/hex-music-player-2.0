import { observer } from '@legendapp/state/react';
import { Avatar, Box, Grid2 as Grid, Typography } from '@mui/material';
import { Track } from 'api';
import { audio } from 'audio';
import chroma from 'chroma-js';
import Rating from 'components/rating/Rating';
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { createAlbumNavigate, createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

import { DetailsActions } from '../NowPlayingSectionActions';

const getTrackEncodingText = (track: Track) => {
  if (track.media[0].parts[0].streams[0].codec === 'flac') {
    const { bitDepth } = track.media[0].parts[0].streams[0];
    const samplingRate = (Math.round(track.media[0].parts[0].streams[0].samplingRate / 1000) * 1000)
      .toString()
      .replaceAll('0', '');
    return `${samplingRate}/${bitDepth}`;
  }
  if (track.media[0].parts[0].streams[0].codec === 'aac') {
    const { bitrate } = track.media[0].parts[0].streams[0];
    return bitrate;
  }
  if (track.media[0].parts[0].streams[0].codec === 'mp3') {
    const { bitrate } = track.media[0].parts[0].streams[0];
    return bitrate;
  }
  return '';
};

const Metadata: React.FC = observer(function NowPlayingMetadata() {
  const nowPlaying = store.queue.nowPlaying.get();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box alignItems="flex-end" display="flex" height={0.5}>
        <Typography
          display="-webkit-box"
          fontFamily="Rubik, sans-serif"
          height="fit-content"
          overflow="hidden"
          sx={{
            wordBreak: 'break-word',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          }}
          textAlign="center"
          variant="h3"
          width={1}
        >
          {nowPlaying.track.title}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" width={1}>
        <Typography
          display="-webkit-box"
          fontFamily="inherit"
          overflow="hidden"
          sx={{
            lineHeight: 1.4,
            wordBreak: 'break-word',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
          textAlign="center"
          variant="title1"
        >
          <NavLink
            className="link"
            style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
            to={createArtistNavigate(nowPlaying.track)}
          >
            {nowPlaying.track.originalTitle || nowPlaying.track.grandparentTitle}
          </NavLink>
          &nbsp;&nbsp;—&nbsp;&nbsp;
          <NavLink
            className="link"
            style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
            to={createAlbumNavigate(nowPlaying.track)}
          >
            {nowPlaying.track.parentTitle}
          </NavLink>
        </Typography>
        <Box alignItems="flex-start" display="flex" justifyContent="center" width={1}>
          <Box display="flex" flex="0 0 120px">
            <Typography color="text.secondary" marginLeft="auto" variant="subtitle2">
              {nowPlaying.track.media[0].parts[0].streams[0].codec.toLocaleUpperCase()}
              &nbsp;&nbsp;·&nbsp;&nbsp;
            </Typography>
          </Box>
          <Rating id={nowPlaying.track.id} userRating={nowPlaying.track.userRating / 2 || 0} />
          <Box display="flex" flex="0 0 120px">
            <Typography color="text.secondary" variant="subtitle2">
              &nbsp;&nbsp;·&nbsp;&nbsp;
              {getTrackEncodingText(nowPlaying.track)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" height={64} justifyContent="center" overflow="hidden" paddingY={2}>
        <Box sx={{ transform: 'scaleX(-1) scaleY(-1)' }}>
          <Visualizer />
        </Box>
        <span style={{ flex: '0 0 3px' }} />
        <Box sx={{ transform: 'scaleY(-1)' }}>
          <Visualizer />
        </Box>
      </Box>
    </div>
  );
});

const audioCtx = audio.getAudioNodes().context;
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 64;
audio.getAudioNodes().input.connect(analyser);
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const HEIGHT = 64;
const WIDTH = 128;

const scale = (inputY: number, yRange: number[], xRange: number[]) => {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const percent = (inputY - yMin) / (yMax - yMin);
  return percent * (xMax - xMin) + xMin;
};

const Visualizer: React.FC = observer(function Visualizer() {
  const isPlaying = store.audio.isPlaying.get();
  const animationController = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (canvasCtx: CanvasRenderingContext2D) => {
    const swatch = store.ui.nowPlaying.swatch.peek();
    const color = chroma(swatch.hex);
    animationController.current = requestAnimationFrame(() => draw(canvasCtx));

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(0 0 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    const barWidth = 2;
    let barHeight: number;
    let x = 0;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 4;

      canvasCtx.fillStyle = `rgba(${color.brighten().rgb().join(', ')}, ${scale(barHeight, [0, HEIGHT / 2], [0, 1])})`;
      canvasCtx.fillRect(x, HEIGHT / 2, barWidth, barHeight / 2);
      canvasCtx.fillRect(x, HEIGHT - barHeight / 2 - HEIGHT / 2, barWidth, barHeight / 2);

      x += barWidth + 3;
    }
  };

  useEffect(() => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx) return;
    if (isPlaying) {
      draw(canvasCtx);
      return;
    }
    if (!isPlaying) {
      setTimeout(() => cancelAnimationFrame(animationController.current), 500);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (animationController.current === 0) return;
      cancelAnimationFrame(animationController.current);
    };
  }, []);

  return <canvas height={HEIGHT} ref={canvasRef} width={WIDTH} />;
});

const Artwork: React.FC = observer(function Artwork() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const thumbSrc = library.server.getAuthenticatedUrl(nowPlaying.track.thumb);

  return (
    <Avatar
      src={thumbSrc}
      sx={{
        borderRadius: 1,
        boxShadow: 'var(--mui-shadows-2)',
        height: '-webkit-fill-available',
        marginBottom: 2,
        marginRight: 2,
        maxHeight: 952,
        maxWidth: 952,
        width: '-webkit-fill-available',
      }}
    />
  );
});

const NowPlayingDetails: React.FC = () => {
  return (
    <>
      <Grid
        container
        alignItems="center"
        columnSpacing={0.5}
        height={1}
        maxHeight="min(952px, calc(calc(100vw / 2) - 64px))"
        overflow="hidden"
      >
        <Grid height={1} maxWidth={0.5}>
          <Artwork />
        </Grid>
        <Grid height={1} overflow="hidden" size="grow">
          <Metadata />
        </Grid>
      </Grid>
      <DetailsActions />
    </>
  );
};

export default NowPlayingDetails;
