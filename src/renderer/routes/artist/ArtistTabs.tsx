import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import { Album, Track } from 'api';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import Home from './tabs/Home';

const ArtistTabs: React.FC<{
  mostPlayedTracks: Track[];
  popularTracks: Track[];
  recentTracks: Track[];
  releases: Record<string, Album[]>;
}> = ({ mostPlayedTracks, popularTracks, recentTracks, releases }) => {
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
      <Box marginX={4} maxWidth={1}>
        <TabList
          key={Math.random()}
          sx={(theme) => ({
            alignItems: 'center',
            contain: 'paint',
            '& .MuiTabs-scroller': {
              height: 48,
              overflow: 'auto !important',
              zIndex: 0,
            },
            '& div.MuiButtonBase-root:nth-of-type(1)': {
              background: theme.palette.background.default,
              height: 44,
              opacity: 1,
              position: 'absolute',
              width: 32,
              zIndex: 10,
            },
            '& div.MuiButtonBase-root:nth-last-of-type(1)': {
              background: theme.palette.background.default,
              height: 44,
              opacity: 1,
              position: 'absolute',
              right: 0,
              width: 32,
              zIndex: 10,
            },
            '& .MuiTabs-scrollButtons.Mui-disabled': {
              opacity: '0 !important',
            },
          })}
          variant="scrollable"
          onChange={handleChange}
        >
          {tabs.map((value, index) => (
            <Tab
              key={value}
              label={
                <Typography paddingTop={0.25} variant="subtitle1">
                  {value}
                </Typography>
              }
              sx={{ maxWidth: 192, minHeight: 48 }}
              value={index.toString()}
            />
          ))}
        </TabList>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="0">
          <Home
            mostPlayedTracks={mostPlayedTracks}
            popularTracks={popularTracks}
            recentTracks={recentTracks}
          />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default ArtistTabs;
