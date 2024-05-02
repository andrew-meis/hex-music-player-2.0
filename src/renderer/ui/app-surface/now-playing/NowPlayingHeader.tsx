import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/material';
import TrackRating from 'components/rating/TrackRating';
import React from 'react';
import { store } from 'state';

const NowPlayingArtwork: React.FC<{ albumThumbSrc: string }> = ({ albumThumbSrc }) => {
  return (
    <Box
      style={{
        aspectRatio: 1,
        display: 'flex',
        height: '100%',
        marginTop: 'auto',
        width: 'auto',
      }}
    >
      <Avatar
        slotProps={{
          img: {
            sx: {
              aspectRatio: '1 / 1',
              objectFit: 'fill',
            },
          },
        }}
        src={albumThumbSrc}
        sx={{
          borderRadius: 2,
          boxShadow: 'var(--mui-shadows-2)',
          margin: 2,
          height: 'calc(100% - 32px)',
          width: 'auto',
        }}
      />
    </Box>
  );
};

const NowPlayingHeader: React.FC = observer(function NowPlayingHeader() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const albumThumbSrc = useSelector(() => {
    return library.server.getAuthenticatedUrl(nowPlaying.track.thumb);
  });

  return (
    <Box display="flex" height={1}>
      <NowPlayingArtwork albumThumbSrc={albumThumbSrc} />
      <div
        style={{
          contain: 'paint',
          overflow: 'hidden',
          marginBottom: 16,
          marginRight: 16,
          marginTop: 'auto',
          width: '-webkit-fill-available',
        }}
      >
        <Typography
          display="-webkit-box"
          fontFamily="Rubik, sans-serif"
          lineHeight={1}
          overflow="hidden"
          sx={{
            paddingBottom: 0.5,
            wordBreak: 'break-word',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 5,
          }}
          variant="h1"
          width="calc(100% - 40px)"
        >
          {nowPlaying.track.title}
        </Typography>
        <span style={{ display: 'block', height: 4, width: '100%' }} />
        <Typography
          display="-webkit-box"
          flexShrink={0}
          overflow="hidden"
          sx={{
            wordBreak: 'break-all',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
          }}
          variant="h6"
          width="calc(100% - 40px)"
        >
          {nowPlaying.track.originalTitle || nowPlaying.track.grandparentTitle}
          &thinsp;&thinsp;—&thinsp;&thinsp;
          {nowPlaying.track.parentTitle}
        </Typography>
        <Box alignItems="flex-start" display="flex" overflow="hidden">
          <TrackRating id={nowPlaying.track.id} userRating={nowPlaying.track.userRating / 2 || 0} />
          <Typography color="text.secondary" display="inline-block" variant="subtitle2">
            &thinsp;&thinsp;—&thinsp;&thinsp;
            {nowPlaying.track.parentYear}
          </Typography>
        </Box>
      </div>
    </Box>
  );
});

export default NowPlayingHeader;
