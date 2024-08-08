import { observer, useObserve, useSelector } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { store } from 'state';

import MoreByArtist from './now-playing-similar/MoreByArtist';
import SimilarLastfm from './now-playing-similar/SimilarLastfm';
import SimilarRelated from './now-playing-similar/SimilarRelated';
import SimilarSonically from './now-playing-similar/SimilarSonically';

const NowPlayingSimilar: React.FC = observer(function NowPlayingSimilar() {
  const activeTab = store.ui.nowPlaying.activeTab.get();
  const artist = useSelector(() => store.queue.nowPlaying.get()?.track.grandparentTitle);

  useObserve(store.queue.nowPlaying.id, ({ value, previous }) => {
    if (value === previous) return;
    store.ui.nowPlaying.activeTab.set('0');
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    store.ui.nowPlaying.activeTab.set(newValue);
  };

  const tabs = [
    {
      label: 'Related Tracks',
      icon: <FiRadio />,
    },
    {
      label: 'Sonically Similar',
      icon: <PiWaveform />,
    },
    {
      label: 'last.fm Similar',
      icon: <ImLastfm viewBox="0 0 17 17" />,
    },
    {
      label: `More by ${artist}`,
      icon: <IoMdMicrophone />,
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="-webkit-fill-available"
      margin={2}
      marginLeft={6}
      width="calc(100% - 64px)"
    >
      <TabContext value={activeTab}>
        <TabList onChange={handleChange}>
          {tabs.map((tab, index) => (
            <Tab
              icon={tab.icon}
              iconPosition="start"
              key={tab.label}
              label={
                <Typography paddingTop={0.25} variant="subtitle1">
                  {tab.label}
                </Typography>
              }
              value={index.toString()}
            />
          ))}
        </TabList>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="0">
          <SimilarRelated />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="1">
          <SimilarSonically />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="2">
          <SimilarLastfm />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="3">
          <MoreByArtist />
        </TabPanel>
      </TabContext>
    </Box>
  );
});

export default NowPlayingSimilar;
