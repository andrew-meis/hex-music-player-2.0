import { reactive, Show, useObserve } from '@legendapp/state/react';
import { Dialog } from '@mui/material';
import EditArtist from 'components/artist/EditArtist';
import EditTrack from 'components/track/EditTrack';
import React from 'react';
import { store } from 'state';

const ReactiveDialog = reactive(Dialog);

const Modals: React.FC = () => {
  useObserve(store.ui.modals.values, ({ value }) => {
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
          borderRadius: 2,
          flexDirection: 'row',
          height: 'calc(100% - 68px)',
          justifyContent: 'center',
          margin: '0 8px',
          maxHeight: 456,
          maxWidth: 900,
          width: 624,
        },
      }}
      maxWidth={false}
      onClose={() => store.ui.modals.open.set(false)}
      onTransitionExited={() => {
        store.ui.modals.values.set(undefined);
      }}
    >
      <Show ifReady={store.ui.modals.values.artist}>
        {(value) => <EditArtist artist={value?.artist} tab={value?.tab} />}
      </Show>
      <Show ifReady={store.ui.modals.values.track}>
        {(value) => <EditTrack tab={value?.tab} track={value?.track} />}
      </Show>
    </ReactiveDialog>
  );
};

export default Modals;
