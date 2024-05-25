import { computed, observable } from '@legendapp/state';
import { observer, useObserve } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import { Track } from 'api';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { store } from 'state';
import { SelectObservable } from 'typescript';

import MoreByArtist from './now-playing-similar/MoreByArtist';
import SimilarLastfm from './now-playing-similar/SimilarLastfm';
import SimilarRelated from './now-playing-similar/SimilarRelated';
import SimilarSonically from './now-playing-similar/SimilarSonically';

export const nowPlayingSelectState: SelectObservable = observable({
  items: [] as Track[],
  canMultiselect: computed(() => {
    const items = nowPlayingSelectState.items.get();
    if (!items) return false;
    return new Set(items.map((item) => item._type)).size <= 1;
  }),
  selectedIndexes: [] as number[],
  selectedItems: computed(() => {
    const items = nowPlayingSelectState.items.get();
    if (!items) return [];
    const selectedIndexes = nowPlayingSelectState.selectedIndexes.get();
    return items.filter((_item, index) => selectedIndexes.includes(index));
  }),
});

const tabs = [
  {
    label: 'More by Artist',
    icon: <IoMdMicrophone />,
  },
  {
    label: 'Sonically Similar',
    icon: <PiWaveform />,
  },
  {
    label: 'Related Tracks',
    icon: <FiRadio />,
  },
  {
    label: 'last.fm Similar',
    icon: <ImLastfm viewBox="0 0 17 17" />,
  },
];

const NowPlayingSimilar: React.FC = observer(function NowPlayingSimilar() {
  const activeTab = store.ui.nowPlaying.activeTab.get();

  useObserve(store.queue.nowPlaying.id, ({ value, previous }) => {
    if (value === previous) return;
    store.ui.nowPlaying.activeTab.set('0');
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    store.ui.nowPlaying.activeTab.set(newValue);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="-webkit-fill-available"
      margin={2}
      width="calc(100% - 80px)"
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
              onAnimationEnd={() => store.ui.nowPlaying.tabIsAnimating.set(false)}
              onAnimationStart={() => store.ui.nowPlaying.tabIsAnimating.set(true)}
            />
          ))}
        </TabList>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="0">
          <MoreByArtist />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="1">
          <SimilarSonically />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="2">
          <SimilarRelated />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="3">
          <SimilarLastfm />
        </TabPanel>
      </TabContext>
    </Box>
  );
});

export default NowPlayingSimilar;
