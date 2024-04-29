import { Memo, useObserve } from '@legendapp/state/react';
import { Dialog } from '@mui/material';
import EditLyrics from 'components/track/EditLyrics';
import React from 'react';
import { store } from 'state';

const Modals: React.FC = () => {
  useObserve(store.ui.modals.editLyricsTrack, ({ value }) => {
    if (value) {
      store.ui.modals.open.set('lyrics');
    } else {
      store.ui.modals.open.set('');
    }
  });
  return (
    <Memo>
      {() => {
        const open = store.ui.modals.open.get() === 'lyrics';
        const editLyricsTrack = store.ui.modals.editLyricsTrack.get();
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
            open={open}
            onClose={() => store.ui.modals.open.set('')}
            onTransitionExited={() => store.ui.modals.editLyricsTrack.set(undefined)}
          >
            <EditLyrics track={editLyricsTrack} />
          </Dialog>
        );
      }}
    </Memo>
  );
};

export default Modals;
