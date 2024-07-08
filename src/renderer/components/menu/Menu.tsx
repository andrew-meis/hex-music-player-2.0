import { observer } from '@legendapp/state/react';
import { Menu as MuiMenu } from '@mui/material';
import {
  Album,
  Artist,
  isAlbum,
  isArtist,
  isPlaylist,
  isPlayQueueItem,
  isTrack,
  Playlist,
  PlayQueueItem,
  Track,
} from 'api';
import AlbumMenu from 'components/album/AlbumMenu';
import ArtistMenu from 'components/artist/ArtistMenu';
import PlaylistMenu from 'components/playlist/PlaylistMenu';
import QueueMenu from 'components/queue/QueueMenu';
import TrackMenu from 'components/track/TrackMenu';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const Menu: React.FC = observer(function Menu() {
  const activeMenu = store.ui.menus.activeMenu.get();
  const state = useMemo(() => {
    switch (activeMenu) {
      case SelectObservables.ROUTE_ARTIST_MOST_PLAYED_TRACKS:
        return allSelectObservables[SelectObservables.ROUTE_ARTIST_MOST_PLAYED_TRACKS];
      case SelectObservables.ROUTE_ARTIST_POPULAR_TRACKS:
        return allSelectObservables[SelectObservables.ROUTE_ARTIST_POPULAR_TRACKS];
      case SelectObservables.ROUTE_ARTIST_RECENT_TRACKS:
        return allSelectObservables[SelectObservables.ROUTE_ARTIST_RECENT_TRACKS];
      case SelectObservables.ROUTE_QUEUE:
        return allSelectObservables[SelectObservables.ROUTE_QUEUE];
      case SelectObservables.ROUTE_SEARCH:
        return allSelectObservables[SelectObservables.ROUTE_SEARCH];
      case SelectObservables.UI_NOW_PLAYING:
        return allSelectObservables[SelectObservables.UI_NOW_PLAYING];
      default: {
        return undefined;
      }
    }
  }, [activeMenu]);
  if (!state) return null;

  const items = state.selectedItems.get();
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
      onTransitionExited={() => state.selectedIndexes.set([])}
    >
      {!isEmpty(items) && items.every((item) => isAlbum(item)) && (
        <AlbumMenu albums={items as Album[]} />
      )}
      {!isEmpty(items) && items.every((item) => isArtist(item)) && (
        <ArtistMenu artists={items as Artist[]} />
      )}
      {!isEmpty(items) && items.every((item) => isPlaylist(item)) && (
        <PlaylistMenu playlists={items as Playlist[]} />
      )}
      {!isEmpty(items) && items.every((item) => isPlayQueueItem(item)) && (
        <QueueMenu items={items as PlayQueueItem[]} />
      )}
      {!isEmpty(items) && items.every((item) => isTrack(item)) && (
        <TrackMenu tracks={items as Track[]} />
      )}
    </MuiMenu>
  );
});

export default Menu;
