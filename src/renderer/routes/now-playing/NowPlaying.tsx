import { Memo, Show, useObserve } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams, useLoaderData, useNavigate } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

import { nowPlayingLoader } from './loader';
import { LyricsActions } from './NowPlayingSectionActions';
import NowPlayingAbout from './tabs/NowPlayingAbout';
import NowPlayingDetails from './tabs/NowPlayingDetails';
import NowPlayingHistory from './tabs/NowPlayingHistory';
import NowPlayingLyrics from './tabs/NowPlayingLyrics';
import NowPlayingSimilar from './tabs/NowPlayingSimilar';

const tabs = [
  {
    string: 'metadata',
    label: 'Track Details',
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
    <Box
      borderRadius={4}
      height="calc(100% - 32px)"
      marginTop={1}
      padding={2}
      width="calc(100% - 32px)"
    >
      <Memo>
        {() => {
          const swatch = store.ui.nowPlaying.swatch.get();
          return (
            <div
              style={{
                background: swatch.hex,
                borderRadius: 16,
                height: 'calc(var(--content-height) - 56px)',
                left: 0,
                marginTop: 56,
                opacity: 0.6,
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                width: '100%',
              }}
            />
          );
        }}
      </Memo>
      <NowPlayingLyrics />
      <LyricsActions />
    </Box>
  );
};

const NowPlayingTabs: React.FC = () => {
  const { tab } = useLoaderData() as Awaited<ReturnType<typeof nowPlayingLoader>>;
  const navigate = useNavigate();

  return (
    <TabContext value={tab}>
      <TabList>
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
      <TabPanel sx={{ height: 'calc(100% - 56px)', padding: 0, width: 1 }} value="metadata">
        <NowPlayingDetails />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 56px)', padding: 0, width: 1 }} value="lyrics">
        <NowPlayingLyricsContainer />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 56px)', padding: 0, width: 1 }} value="history">
        <NowPlayingHistory />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 48px)', padding: 0, width: 1 }} value="related">
        <NowPlayingSimilar />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 56px)', padding: 0, width: 1 }} value="about">
        <NowPlayingAbout />
      </TabPanel>
    </TabContext>
  );
};

const NowPlaying: React.FC = () => {
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
        <NowPlayingTabs />
      </RouteContainer>
    </Show>
  );
};

export default NowPlaying;
