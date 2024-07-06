import { reactive, Show, useObserve } from '@legendapp/state/react';
import { Dialog } from '@mui/material';
import EditLyrics from 'components/track/EditLyrics';
import EditMetadata from 'components/track/EditMetadata';
import { round } from 'lodash';
import React from 'react';
import { store } from 'state';

const ReactiveDialog = reactive(Dialog);

const Modals: React.FC = () => {
  useObserve(store.ui.modals.editLyricsTrack, ({ value }) => {
    if (value) {
      store.ui.modals.open.set(true);
    } else {
      store.ui.modals.open.set(false);
    }
  });

  useObserve(store.ui.modals.editMetadataTrack, ({ value }) => {
    if (value) {
      store.ui.modals.open.set(true);
    } else {
      store.ui.modals.open.set(false);
    }
  });

  return (
    <ReactiveDialog
      fullWidth
      $open={() => store.ui.modals.open.get()}
      PaperProps={{
        elevation: 2,
        sx: {
          flexDirection: 'row',
          height: 'calc(100% - 162px)',
          justifyContent: 'center',
          margin: '0 8px',
          maxHeight: 512,
          maxWidth: 900,
          width: `calc(${round((314 / 466) * 100, 4)}vh * (21 / 9))`,
        },
      }}
      maxWidth={false}
      onClose={() => store.ui.modals.open.set(false)}
      onTransitionExited={() => {
        store.ui.modals.editLyricsTrack.set(undefined);
        store.ui.modals.editMetadataTrack.set(undefined);
      }}
    >
      <Show ifReady={store.ui.modals.editLyricsTrack}>
        {(track) => <EditLyrics track={track!} />}
      </Show>
      <Show ifReady={store.ui.modals.editMetadataTrack}>
        {(track) => <EditMetadata track={track!} />}
      </Show>
    </ReactiveDialog>
  );
};

export default Modals;
