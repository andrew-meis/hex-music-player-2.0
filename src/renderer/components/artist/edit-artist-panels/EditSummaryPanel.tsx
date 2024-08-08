import { useObservable } from '@legendapp/state/react';
import { Box, InputBase } from '@mui/material';
import { Artist } from 'api';
import EditFab from 'components/edit/EditFab';
import Scroller from 'components/scroller/Scroller';
import React, { useState } from 'react';
import { store } from 'state';

const EditSummaryPanel: React.FC<{ artist: Artist }> = ({ artist }) => {
  const isModified = useObservable(false);
  const [value, setValue] = useState(artist.summary || '');

  const handleSave = () => {
    const { sectionId } = store.serverConfig.peek();
    const library = store.library.peek();
    library.editArtist(artist.id, { summary: value }, sectionId);
  };

  return (
    <Box display="flex" flexDirection="column" height={1} width={1}>
      <Box
        bgcolor="background.default"
        border="1px dashed var(--mui-palette-action-disabled)"
        borderRadius={1}
        flexGrow={1}
        height={224}
      >
        <Scroller style={{ height: '100%' }}>
          <Box overflow="auto">
            <InputBase
              fullWidth
              multiline
              inputProps={{
                style: {
                  padding: '0 5px',
                },
              }}
              minRows={9}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                isModified.set(true);
                if (event.target.value === artist.summary) {
                  isModified.set(false);
                }
              }}
            />
          </Box>
        </Scroller>
      </Box>
      <EditFab isVisible={isModified} onClick={handleSave} />
    </Box>
  );
};

export default EditSummaryPanel;
