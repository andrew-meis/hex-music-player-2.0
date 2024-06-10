import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LastFMArtist } from 'lastfm-ts-api';
import React from 'react';
import { persistedStore, store } from 'state';
import { QueryKeys } from 'typescript';

const NowPlayingAbout: React.FC = observer(function NowPlayingAbout() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const artistBannerSrc = useSelector(() => {
    return library.server.getAuthenticatedUrl(nowPlaying.track.grandparentArt);
  });

  const artistThumbSrc = useSelector(() => {
    return library.server.getAuthenticatedUrl(nowPlaying.track.grandparentThumb);
  });

  const { data } = useQuery({
    queryKey: [QueryKeys.LASTFM_ARTIST, nowPlaying.track.grandparentId],
    queryFn: () => {
      const lastfmArtist = new LastFMArtist(persistedStore.lastfmApiKey.peek());
      return lastfmArtist.getInfo({
        artist:
          nowPlaying.track.grandparentTitle === 'Various Artists'
            ? nowPlaying.track.originalTitle
            : nowPlaying.track.grandparentTitle,
        autocorrect: 1,
      });
    },
  });

  return (
    <motion.div
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      key={nowPlaying.track.id}
      style={{
        height: '100%',
      }}
    >
      {!nowPlaying.track.grandparentArt && (
        <Avatar
          slotProps={{
            img: {
              sx: {
                objectPosition: 'center top',
                maskImage: `linear-gradient(to top, transparent 10%, rgba(0, 0, 0, 1) 80%)`,
              },
            },
          }}
          src={artistThumbSrc}
          sx={{
            aspectRatio: 16 / 9,
            background: 'transparent',
            borderRadius: 4,
            height: 'auto',
            marginLeft: 6,
            marginTop: 2,
            marginBottom: 'auto',
            width: 400,
          }}
        />
      )}
      <Box
        borderRadius={4}
        display="flex"
        height="-webkit-fill-available"
        margin={2}
        marginLeft={6}
        position="absolute"
        sx={{
          background: `url(${artistBannerSrc}) no-repeat`,
          backgroundSize: '100%',
          maskImage: `linear-gradient(to top, transparent 20%, rgba(0, 0, 0, 1) 80%)`,
        }}
        width="-webkit-fill-available"
      />
      {data && (
        <Box bottom={0} padding={4} paddingBottom={2} paddingLeft={8} position="absolute">
          <Typography color="text.primary" lineHeight={3} variant="h6">
            {(+data.artist.stats.listeners).toLocaleString()} last.fm listeners
          </Typography>
          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {data?.artist.bio.content.replaceAll(/\[[0-9]\]/g, '').split('<a href')[0]}
          </Typography>
        </Box>
      )}
    </motion.div>
  );
});

export default NowPlayingAbout;
