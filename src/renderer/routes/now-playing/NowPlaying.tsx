import { Memo, observer, Show, useObserve } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Avatar,
  Box,
  Grid2 as Grid,
  SxProps,
  Tab,
  Theme,
  Typography,
  useColorScheme,
} from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

import { LyricsActions } from './NowPlayingSectionActions';
import NowPlayingAbout from './tabs/NowPlayingAbout';
import NowPlayingDetails from './tabs/NowPlayingDetails';
import NowPlayingHistory from './tabs/NowPlayingHistory';
import NowPlayingLyrics from './tabs/NowPlayingLyrics';
import NowPlayingSimilar from './tabs/NowPlayingSimilar';

const tabs = [
  {
    string: 'metadata',
    label: 'Current Track',
  },
  {
    string: 'lyrics',
    label: 'Lyrics',
  },
  {
    string: 'history',
    label: 'Play History',
  },
  {
    string: 'related',
    label: 'Related Tracks',
  },
  {
    string: 'about',
    label: 'About the Artist',
  },
];

const NowPlayingLyricsContainer: React.FC = () => {
  return (
    <Box height={1}>
      <NowPlayingLyrics />
      <LyricsActions />
    </Box>
  );
};

const sx: SxProps<Theme> = {
  height: 'calc(100% - 80px)',
  padding: 0,
  position: 'relative',
  top: 64,
  width: 'calc(100% - 16px)',
};

const NowPlayingTabs: React.FC = observer(function NowPlayingTabs() {
  const { tab } = store.loaders.nowPlaying.get();
  const navigate = useNavigate();

  return (
    <TabContext value={tab}>
      <TabList sx={{ left: 0, position: 'absolute' }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={
              <Typography paddingTop={0.25} variant="subtitle1">
                {tab.label}
              </Typography>
            }
            value={tab.string}
            onClick={() =>
              navigate({
                pathname: '/now-playing',
                search: createSearchParams({ tab: tab.string }).toString(),
              })
            }
          />
        ))}
      </TabList>
      <TabPanel sx={sx} value="metadata">
        <NowPlayingDetails />
      </TabPanel>
      <TabPanel sx={sx} value="lyrics">
        <NowPlayingLyricsContainer />
      </TabPanel>
      <TabPanel sx={sx} value="history">
        <NowPlayingHistory />
      </TabPanel>
      <TabPanel sx={sx} value="related">
        <NowPlayingSimilar />
      </TabPanel>
      <TabPanel sx={sx} value="about">
        <NowPlayingAbout />
      </TabPanel>
    </TabContext>
  );
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
        margin: 2,
        marginTop: 8,
        maxHeight: 952,
        maxWidth: 952,
        width: '-webkit-fill-available',
      }}
    />
  );
});

const NowPlaying: React.FC = () => {
  const { mode } = useColorScheme();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Now Playing',
        to: {
          pathname: '/now-playing',
          search: createSearchParams({ tab: 'metadata' }).toString(),
        },
      },
    ]);
  }, []);

  useObserve(store.queue.nowPlaying.id, ({ value, previous }) => {
    if (value === previous) return;
    store.ui.nowPlaying.activeSimilarTracksTab.set('0');
  });

  return (
    <Show else={<Box height={1} width={1} />} ifReady={store.queue.nowPlaying}>
      <RouteContainer
        style={{
          height: '100%',
          margin: 0,
          width: '100%',
        }}
      >
        <Memo>
          {() => {
            const swatch = store.ui.nowPlaying.swatch.get();
            return (
              <div
                style={{
                  background: swatch.hex,
                  borderRadius: 16,
                  height: 'var(--content-height)',
                  left: 0,
                  maxHeight: 'min(952px, calc(calc(100vw / 2) - 64px))',
                  opacity: mode === 'dark' ? 0.6 : 0.2,
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                }}
              />
            );
          }}
        </Memo>
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
            <NowPlayingTabs />
          </Grid>
        </Grid>
      </RouteContainer>
    </Show>
  );
};

export default NowPlaying;
