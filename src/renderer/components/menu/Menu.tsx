import { observer } from '@legendapp/state/react';
import { Menu as MuiMenu } from '@mui/material';
import { isPlayQueueItem, isTrack } from 'api';
import QueueMenu from 'components/queue/QueueMenu';
import TrackMenu from 'components/track/TrackMenu';
import { isEmpty } from 'lodash';
import React from 'react';
import { store } from 'state';

const Menu: React.FC = observer(function Menu() {
  const menuItems = store.ui.menus.items.get();
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
      onTransitionExited={() => store.ui.menus.items.set([])}
    >
      {!isEmpty(menuItems) && menuItems.every((item) => isPlayQueueItem(item)) && <QueueMenu />}
      {!isEmpty(menuItems) && menuItems.every((item) => isTrack(item)) && <TrackMenu />}
    </MuiMenu>
  );
});

export default Menu;
