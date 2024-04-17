import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/joy';
import TrackRating from 'components/rating/TrackRating';
import React from 'react';
import { store } from 'state';

const NowPlayingArtwork: React.FC<{ albumThumbSrc: string }> = ({ albumThumbSrc }) => {
  return (
    <Box
      style={{
        aspectRatio: 1,
        borderRadius: 8,
        display: 'flex',
        height: 'calc(100% - 48px)',
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
          borderRadius: 8,
          boxShadow: 'var(--joy-shadow-sm)',
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
  const nowPlaying = store.audio.nowPlaying.get();

  const albumThumbSrc = useSelector(() => {
    return library.api.getAuthenticatedUrl(nowPlaying.track.thumb);
  });

  return (
    <Box display="flex" height={1}>
      <NowPlayingArtwork albumThumbSrc={albumThumbSrc} />
      <div style={{ marginBottom: 16, marginRight: 16, marginTop: 'auto' }}>
        <Typography level="h1" lineHeight={1}>
          {nowPlaying.track.title}
        </Typography>
        <span style={{ display: 'block', flexShrink: 0, height: '4px', width: '100%' }} />
        <Typography
          display="-webkit-box"
          flexShrink={0}
          level="title-lg"
          overflow="hidden"
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
          }}
        >
          {nowPlaying.track.originalTitle || nowPlaying.track.grandparentTitle}
          &thinsp;&thinsp;—&thinsp;&thinsp;
          {nowPlaying.track.parentTitle}
        </Typography>
        <span style={{ display: 'block', flexShrink: 0, height: '4px', width: '100%' }} />
        <Box display="flex">
          <TrackRating
            id={nowPlaying.track.id}
            library={library}
            userRating={nowPlaying.track.userRating}
          />
          <Typography display="inline-block" level="body-sm">
            &thinsp;&thinsp;—&thinsp;&thinsp;
            {nowPlaying.track.parentYear}
          </Typography>
        </Box>
      </div>
    </Box>
  );
});

export default NowPlayingHeader;
