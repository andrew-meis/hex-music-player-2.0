import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import { Album, Artist, Track } from 'api';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import HomeTab from './tabs/HomeTab';
import ReleaseTab from './tabs/ReleaseTab';

const tabIndexes = {
  Home: 0,
  Albums: 1,
  'Singles & EPs': 2,
  'Live Albums': 3,
  Soundtracks: 4,
  Compilations: 5,
  Demos: 6,
  Remixes: 7,
  'Appears On': 8,
  About: 9,
};

const ArtistTabs: React.FC<{
  artist: Artist;
  mostPlayedTracks: Track[];
  popularTracks: Track[];
  recentTracks: Track[];
  releases: Record<string, Album[]>;
  viewport: HTMLDivElement | undefined;
}> = ({ artist, mostPlayedTracks, popularTracks, recentTracks, releases, viewport }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = useMemo(() => {
    return ['Home', ...Object.keys(releases), 'About'];
  }, [releases]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    searchParams.set('tabIndex', newValue);
    setSearchParams(searchParams);
  };

  return (
    <TabContext value={searchParams.get('tabIndex')!}>
      <Box>
        <TabList
          scrollButtons
          sx={{
            width: 1,
            '& .MuiTabs-scroller': {
              overflow: 'auto !important',
            },
            '& div.MuiButtonBase-root:nth-of-type(1)': {
              width: 32,
            },
            '& div.MuiButtonBase-root:nth-last-of-type(1)': {
              width: 32,
            },
            '& .MuiTabs-scrollButtons.Mui-disabled': {
              opacity: '0.3 !important',
            },
          }}
          variant="scrollable"
          onChange={handleChange}
        >
          {tabs.map((value) => (
            <Tab
              key={value}
              label={
                <Typography paddingTop={0.25} variant="subtitle1">
                  {value}
                </Typography>
              }
              sx={{ minHeight: 48 }}
              value={tabIndexes[value].toString()}
            />
          ))}
        </TabList>
      </Box>
      <Box marginX={4} maxWidth={1}>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="0">
          <HomeTab
            artist={artist}
            mostPlayedTracks={mostPlayedTracks}
            popularTracks={popularTracks}
            recentTracks={recentTracks}
          />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="1">
          <ReleaseTab releases={releases['Albums']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="2">
          <ReleaseTab releases={releases['Singles & EPs']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="3">
          <ReleaseTab releases={releases['Live Albums']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="4">
          <ReleaseTab releases={releases['Soundtracks']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="5">
          <ReleaseTab releases={releases['Compilations']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="6">
          <ReleaseTab releases={releases['Demos']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="7">
          <ReleaseTab releases={releases['Remixes']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="8">
          <ReleaseTab releases={releases['Appears On']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="9">
          <Box minHeight="var(--content-height)" />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default ArtistTabs;
