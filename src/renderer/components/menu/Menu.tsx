import { observer } from '@legendapp/state/react';
import { Menu as MuiMenu } from '@mui/material';
import { isAlbum, isArtist, isPlayQueueItem, isTrack } from 'api';
import AlbumMenu from 'components/album/AlbumMenu';
import ArtistMenu from 'components/artist/ArtistMenu';
import QueueMenu from 'components/queue/QueueMenu';
import TrackMenu from 'components/track/TrackMenu';
import { isEmpty } from 'lodash';
import React from 'react';
import { store } from 'state';

const Menu: React.FC = observer(function Menu() {
  const items = store.ui.select.selectedItems.get();
  const anchorPosition = store.ui.menus.anchorPosition.get();

  const handleClose = () => {
    store.ui.menus.anchorPosition.set(null);
  };

  return (
    <MuiMenu
      anchorPosition={
        anchorPosition !== null
          ? { top: anchorPosition.mouseY, left: anchorPosition.mouseX }
          : undefined
      }
      anchorReference="anchorPosition"
      open={anchorPosition !== null}
      onClose={handleClose}
      onTransitionExited={() => store.ui.select.selected.set([])}
    >
      {!isEmpty(items) && items.every((item) => isAlbum(item)) && <AlbumMenu />}
      {!isEmpty(items) && items.every((item) => isArtist(item)) && <ArtistMenu />}
      {!isEmpty(items) && items.every((item) => isPlayQueueItem(item)) && <QueueMenu />}
      {!isEmpty(items) && items.every((item) => isTrack(item)) && <TrackMenu />}
    </MuiMenu>
  );
});

export default Menu;
