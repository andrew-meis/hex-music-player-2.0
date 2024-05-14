import { observer, useObserve, useSelector } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import { Track } from 'api';
import TrackRow from 'components/track/TrackRow';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { store } from 'state';

import SimilarLastfm from './now-playing-similar/SimilarLastfm';
import SimilarMoreByArtist from './now-playing-similar/SimilarMoreByArtist';
import SimilarRelated from './now-playing-similar/SimilarRelated';
import SimilarSonically from './now-playing-similar/SimilarSonically';

export const Item: React.FC<{
  data: Track;
  index: number;
}> = ({ data, index }) => <TrackRow index={index} track={data} />;

const NowPlayingSimilar: React.FC = observer(function NowPlayingSimilar() {
  const activeTab = store.ui.nowPlaying.activeTab.get();

  useObserve(store.queue.nowPlaying.id, ({ value, previous }) => {
    if (value === previous) return;
    store.ui.nowPlaying.activeTab.set('0');
  });

  const tabs = useSelector(() => {
    const nowPlaying = store.queue.nowPlaying.get();
    return [
      {
        label: `More by${' '}
        ${
          nowPlaying.track.grandparentTitle === 'Various Artists'
            ? nowPlaying.track.originalTitle
            : nowPlaying.track.grandparentTitle
        }`,
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
          <SimilarMoreByArtist />
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
