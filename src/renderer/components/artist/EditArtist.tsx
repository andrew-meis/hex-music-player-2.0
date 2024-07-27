import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, IconButton, SvgIcon, Tab, Typography } from '@mui/material';
import { Artist } from 'api';
import React, { useState } from 'react';
import { MdClear } from 'react-icons/md';
import { store } from 'state';

import EditAppearsOnPanel from './edit-artist-panels/EditAppearsOnPanel';
import EditTagsPanel from './edit-artist-panels/EditTagsPanel';

const EditArtist: React.FC<{ artist?: Artist }> = ({ artist }) => {
  const [activeTab, setActiveTab] = useState('0');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  if (!artist) return null;

  return (
    <Box display="flex" flexDirection="column" height="-webkit-fill-available" margin={2} width={1}>
      <Box alignItems="center" display="flex" justifyContent="space-between" paddingBottom={1}>
        <Typography variant="h4">Edit Artist</Typography>
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
                Appears On
              </Typography>
            }
            value="2"
          />
        </TabList>
        <TabPanel sx={{ height: 1, overflow: 'hidden', padding: 0, width: 1 }} value="0">
          <Box bgcolor="tomato" />
        </TabPanel>
        <TabPanel sx={{ height: 1, overflow: 'hidden', padding: 0, width: 1 }} value="1">
          <EditTagsPanel artist={artist} />
        </TabPanel>
        <TabPanel sx={{ height: 1, overflow: 'hidden', padding: 0, width: 1 }} value="2">
          <EditAppearsOnPanel artist={artist} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default EditArtist;
