import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, IconButton, SvgIcon, Tab, Typography } from '@mui/material';
import { Track } from 'api';
import React, { useState } from 'react';
import { MdClear } from 'react-icons/md';
import { store } from 'state';

import EditGeneralPanel from './edit-track-panels/EditGeneralPanel';
import EditLyricsPanel from './edit-track-panels/EditLyricsPanel';
import EditTagsPanel from './edit-track-panels/EditTagsPanel';

const EditTrack: React.FC<{ tab?: string; track?: Track }> = ({ tab = '0', track }) => {
  const [activeTab, setActiveTab] = useState(tab);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  if (!track) return null;

  return (
    <Box display="flex" flexDirection="column" height="-webkit-fill-available" margin={2} width={1}>
      <Box alignItems="center" display="flex" justifyContent="space-between" paddingBottom={1}>
        <Typography variant="h4">Edit Track</Typography>
        <IconButton onClick={() => store.ui.modals.open.set(false)}>
          <SvgIcon>
            <MdClear />
          </SvgIcon>
        </IconButton>
      </Box>
      <TabContext value={activeTab}>
        <TabList onChange={handleChange}>
          <Tab
            label={
              <Typography paddingTop={0.25} variant="subtitle1">
                General
              </Typography>
            }
            value="0"
          />
          <Tab
            label={
              <Typography paddingTop={0.25} variant="subtitle1">
                Tags
              </Typography>
            }
            value="1"
          />
          <Tab
            label={
              <Typography paddingTop={0.25} variant="subtitle1">
                Lyrics
              </Typography>
            }
            value="2"
          />
        </TabList>
        <TabPanel sx={{ height: 1, overflow: 'hidden', padding: 0, width: 1 }} value="0">
          <EditGeneralPanel track={track} />
        </TabPanel>
        <TabPanel sx={{ height: 1, overflow: 'hidden', padding: 0, width: 1 }} value="1">
          <EditTagsPanel track={track} />
        </TabPanel>
        <TabPanel sx={{ height: 1, overflow: 'hidden', padding: 0, width: 1 }} value="2">
          <EditLyricsPanel track={track} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default EditTrack;
