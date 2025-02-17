import { reactive, Show, useObserve } from '@legendapp/state/react';
import { Dialog } from '@mui/material';
import EditArtist from 'components/artist/EditArtist';
import EditTrack from 'components/track/EditTrack';
import React from 'react';
import { store } from 'state';
import { EditPlaylistFolder } from 'ui/app-panels/drawers/PlaylistsDrawer';

const ReactiveDialog = reactive(Dialog);

const small: React.ComponentProps<typeof ReactiveDialog> = {
  $open: () => store.ui.modals.open.get(),
  fullWidth: true,
  maxWidth: false,
  PaperProps: {
    elevation: 2,
    sx: {
      borderRadius: 2,
      flexDirection: 'row',
      height: 256,
      justifyContent: 'center',
      margin: '0 8px',
      width: 352,
    },
  },
  onClose: () => store.ui.modals.open.set(false),
  onTransitionExited: () => store.ui.modals.values.set(undefined),
};

const large: React.ComponentProps<typeof ReactiveDialog> = {
  $open: () => store.ui.modals.open.get(),
  fullWidth: true,
  maxWidth: false,
  PaperProps: {
    elevation: 2,
    sx: {
      borderRadius: 2,
      flexDirection: 'row',
      height: 456,
      justifyContent: 'center',
      margin: '0 8px',
      width: 624,
    },
  },
  onClose: () => store.ui.modals.open.set(false),
  onTransitionExited: () => store.ui.modals.values.set(undefined),
};

const Modals: React.FC = () => {
  useObserve(store.ui.modals.values, ({ value }) => {
    if (value) {
      store.ui.modals.open.set(true);
    } else {
      store.ui.modals.open.set(false);
    }
  });

  return (
    <>
      <Show ifReady={store.ui.modals.values.folder}>
        {(value) => (
          <ReactiveDialog {...small}>
            <EditPlaylistFolder action={value!.action} currentName={value!.currentName} />
          </ReactiveDialog>
        )}
      </Show>
      <Show ifReady={store.ui.modals.values.artist}>
        {(value) => (
          <ReactiveDialog {...large}>
            <EditArtist artist={value?.artist} tab={value?.tab} />
          </ReactiveDialog>
        )}
      </Show>
      <Show ifReady={store.ui.modals.values.track}>
        {(value) => (
          <ReactiveDialog {...large}>
            <EditTrack tab={value?.tab} track={value?.track} />
          </ReactiveDialog>
        )}
      </Show>
    </>
  );
};

export default Modals;
