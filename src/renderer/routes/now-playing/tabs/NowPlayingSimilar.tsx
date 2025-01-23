import { observer } from '@legendapp/state/react';
import { TabContext, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { store } from 'state';

import { SimilarTracksActions } from '../NowPlayingSectionActions';
import MoreByArtist from '../similar-tracks-pages/MoreByArtist';
import SimilarLastfm from '../similar-tracks-pages/SimilarLastfm';
import SimilarRelated from '../similar-tracks-pages/SimilarRelated';
import SimilarSonically from '../similar-tracks-pages/SimilarSonically';

const NowPlayingSimilar: React.FC = observer(function NowPlayingSimilar() {
  const activeTab = store.ui.nowPlaying.activeSimilarTracksTab.get();

  return (
    <Box display="flex" flexDirection="column" height={1} width={1}>
      <TabContext value={activeTab}>
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
      <SimilarTracksActions />
    </Box>
  );
});

export default NowPlayingSimilar;
