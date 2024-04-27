import { Memo } from '@legendapp/state/react';
import { Dialog } from '@mui/material';
import EditLyrics from 'components/track/EditLyrics';
import React from 'react';
import { store } from 'state';

const Modals: React.FC = () => {
  return (
    <Memo>
      {() => {
        const editLyricsTrack = store.ui.modals.editLyrics.get();
        return (
          <Dialog
            fullWidth
            PaperProps={{
              elevation: 2,
              sx: {
                padding: 2,
                paddingBottom: 4,
              },
            }}
            maxWidth="sm"
            open={!!editLyricsTrack}
            onClose={() => store.ui.modals.editLyrics.set(undefined)}
          >
            {!!editLyricsTrack && <EditLyrics track={editLyricsTrack} />}
          </Dialog>
        );
      }}
    </Memo>
  );
};

export default Modals;
