import { Memo } from '@legendapp/state/react';
import { Modal, ModalDialog } from '@mui/joy';
import EditLyrics from 'components/track/EditLyrics';
import React from 'react';
import { store } from 'state';

const Modals: React.FC = () => {
  return (
    <Memo>
      {() => {
        const editLyricsTrack = store.ui.modals.editLyrics.get();
        return (
          <Modal open={!!editLyricsTrack} onClose={() => store.ui.modals.editLyrics.set(undefined)}>
            <ModalDialog sx={{ overflow: 'hidden', width: 1 }}>
              <EditLyrics track={editLyricsTrack} />
            </ModalDialog>
          </Modal>
        );
      }}
    </Memo>
  );
};

export default Modals;
