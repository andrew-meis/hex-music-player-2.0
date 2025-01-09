import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box } from '@mui/material';
import chroma from 'chroma-js';
import React from 'react';
import { store } from 'state';

import { HeaderActions } from '../NowPlayingSectionActions';

// const getTrackEncodingText = (track: Track) => {
//   if (track.media[0].parts[0].streams[0].codec === 'flac') {
//     const { bitDepth } = track.media[0].parts[0].streams[0];
//     const samplingRate = (Math.round(track.media[0].parts[0].streams[0].samplingRate / 1000) * 1000)
//       .toString()
//       .replaceAll('0', '');
//     return `${samplingRate}/${bitDepth}`;
//   }
//   if (track.media[0].parts[0].streams[0].codec === 'aac') {
//     const { bitrate } = track.media[0].parts[0].streams[0];
//     return bitrate;
//   }
//   if (track.media[0].parts[0].streams[0].codec === 'mp3') {
//     const { bitrate } = track.media[0].parts[0].streams[0];
//     return bitrate;
//   }
//   return '';
// };

const NowPlayingArtwork: React.FC = observer(function NowPlayingArtwork() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const albumThumbSrc = useSelector(() => {
    return library.server.getAuthenticatedUrl(nowPlaying.track.thumb);
  });

  return (
    <Box sx={{ contain: 'paint' }}>
      <Avatar
        src={albumThumbSrc}
        sx={{
          borderRadius: 2,
          boxShadow: 'var(--mui-shadows-2)',
          height: '-webkit-fill-available',
          marginTop: 1,
          width: '-webkit-fill-available',
        }}
      />
      <Box
        borderRadius={2}
        marginTop={1}
        position="absolute"
        sx={(theme) => ({
          background: 'transparent',
          height: '-webkit-fill-available',
          top: 0,
          transition: 'background 300ms',
          width: '-webkit-fill-available',
          '&:hover': {
            background: chroma(theme.palette.background.default).alpha(0.33).css(),
          },
        })}
        onMouseEnter={() => store.ui.nowPlaying.artHovered.set(true)}
        onMouseLeave={() => store.ui.nowPlaying.artHovered.set(false)}
      >
        <HeaderActions />
      </Box>
    </Box>
  );
});

const NowPlayingDetails: React.FC = () => {
  return (
    <Box className="now-playing-grid">
      <Box className="now-playing-artwork">
        <NowPlayingArtwork />
      </Box>
      <Box className="now-playing-metadata" />
    </Box>
  );
};

export default NowPlayingDetails;
