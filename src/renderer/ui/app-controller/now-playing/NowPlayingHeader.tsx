import { ObservablePrimitiveBaseFns } from '@legendapp/state';
import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/material';
import { Track } from 'api';
import chroma from 'chroma-js';
import Rating from 'components/rating/Rating';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { createAlbumNavigate, createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

import { HeaderActions } from './NowPlayingSectionActions';

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

const NowPlayingArtwork: React.FC<{
  activeSection: ObservablePrimitiveBaseFns<number>;
  albumThumbSrc: string;
}> = ({ activeSection, albumThumbSrc }) => {
  return (
    <Box
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
      }}
    >
      <Avatar
        slotProps={{
          img: {
            sx: {
              aspectRatio: 1,
              objectFit: 'fill',
            },
          },
        }}
        src={albumThumbSrc}
        sx={{
          borderRadius: 2,
          boxShadow: 'var(--mui-shadows-2)',
          margin: 2,
          height: 'min(calc(100% - 32px), 40vw)',
          maxHeight: 1000,
          maxWidth: 1000,
          width: 'auto',
        }}
      />
      <Box
        borderRadius={2}
        height="min(calc(100% - 32px), 40vw)"
        margin={2}
        position="absolute"
        sx={(theme) => ({
          aspectRatio: 1,
          background: 'transparent',
          maxHeight: 1000,
          maxWidth: 1000,
          transition: 'background 300ms',
          '&:hover': {
            background: chroma(theme.palette.background.default).alpha(0.33).css(),
          },
        })}
        onMouseEnter={() => store.ui.nowPlaying.artHovered.set(true)}
        onMouseLeave={() => store.ui.nowPlaying.artHovered.set(false)}
      >
        <HeaderActions activeSection={activeSection} />
      </Box>
    </Box>
  );
};

const NowPlayingHeader: React.FC<{ activeSection: ObservablePrimitiveBaseFns<number> }> = observer(
  function NowPlayingHeader({ activeSection }) {
    const library = store.library.get();
    const nowPlaying = store.queue.nowPlaying.get();

    const albumThumbSrc = useSelector(() => {
      return library.server.getAuthenticatedUrl(nowPlaying.track.thumb);
    });

    return (
      <Box display="flex" height={1}>
        <div
          style={{
            contain: 'paint',
            flexGrow: 1,
            overflow: 'hidden',
            marginLeft: 48,
            textAlign: 'center',
          }}
        >
          <Box alignItems="flex-end" display="flex" height={0.5}>
            <Typography
              display="-webkit-box"
              fontFamily="Rubik, sans-serif"
              overflow="hidden"
              sx={{
                height: 'fit-content',
                wordBreak: 'break-word',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
              }}
              variant="h4"
              width={1}
            >
              {nowPlaying.track.title}
            </Typography>
          </Box>
          <Box alignItems="flex-start" display="flex" flexDirection="column" height={0.5}>
            <span style={{ display: 'block', height: 4, width: '100%' }} />
            <Box alignItems="center" display="flex" flexDirection="column" width={1}>
              <Typography
                color="text.secondary"
                display="-webkit-box"
                flexShrink={0}
                overflow="hidden"
                sx={{
                  wordBreak: 'break-word',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
                variant="body1"
                width={1}
              >
                <NavLink
                  className="link"
                  style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
                  to={createArtistNavigate(nowPlaying.track)}
                >
                  {nowPlaying.track.originalTitle || nowPlaying.track.grandparentTitle}
                </NavLink>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                <NavLink
                  className="link"
                  style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
                  to={createAlbumNavigate(nowPlaying.track)}
                >
                  {nowPlaying.track.parentTitle}
                </NavLink>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                {nowPlaying.track.parentYear}
              </Typography>
            </Box>
            <Box
              alignItems="flex-start"
              display="flex"
              justifyContent="center"
              marginTop={0.25}
              overflow="hidden"
              width={1}
            >
              <Box flex="0 0 100px" marginRight={2}>
                <Typography color="text.secondary" textAlign="right" variant="subtitle2">
                  {nowPlaying.track.media[0].parts[0].streams[0].codec.toLocaleUpperCase()}
                </Typography>
              </Box>
              <Rating id={nowPlaying.track.id} userRating={nowPlaying.track.userRating / 2 || 0} />
              <Box flex="0 0 100px" marginLeft={2}>
                <Typography color="text.secondary" textAlign="left" variant="subtitle2">
                  {getTrackEncodingText(nowPlaying.track)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </div>
        <NowPlayingArtwork activeSection={activeSection} albumThumbSrc={albumThumbSrc} />
      </Box>
    );
  }
);

export default NowPlayingHeader;
