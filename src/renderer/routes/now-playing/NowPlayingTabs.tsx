import { Memo, observer } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import React from 'react';
import { createSearchParams, useLoaderData, useNavigate } from 'react-router-dom';
import { store } from 'state';

import { nowPlayingLoader } from './loader';
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

const NowPlayingLyricsWrapper: React.FC = observer(function NowPlayingLyricsWrapper() {
  return (
    <Box
      borderRadius={4}
      height="calc(100% - 40px)"
      marginTop={1}
      padding={2}
      sx={{
        contain: 'paint',
      }}
      width="calc(100% - 32px)"
    >
      <Memo>
        {() => {
          const swatch = store.ui.nowPlaying.swatch.get();
          return (
            <div
              style={{
                background: swatch.hex,
                height: '100%',
                left: 0,
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
    </Box>
  );
});

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
      <TabPanel sx={{ height: 'calc(100% - 32px)', padding: 0, width: 1 }} value="metadata">
        <NowPlayingDetails />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 32px)', padding: 0, width: 1 }} value="lyrics">
        <NowPlayingLyricsWrapper />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 32px)', padding: 0, width: 1 }} value="history">
        <NowPlayingHistory />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 32px)', padding: 0, width: 1 }} value="related">
        <NowPlayingSimilar />
      </TabPanel>
      <TabPanel sx={{ height: 'calc(100% - 32px)', padding: 0, width: 1 }} value="about">
        <NowPlayingAbout />
      </TabPanel>
    </TabContext>
  );
};

export default NowPlayingTabs;
