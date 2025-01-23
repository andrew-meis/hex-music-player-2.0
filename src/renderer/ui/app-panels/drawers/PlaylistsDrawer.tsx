import { observer, reactive, Show, useSelector } from '@legendapp/state/react';
import {
  Box,
  ClickAwayListener,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Album, Artist, isPlaylistItem, Playlist, PlaylistItem, Track } from 'api';
import Scroller from 'components/scroller/Scroller';
import { playlistActions } from 'features/playlist';
import { selectActions } from 'features/select';
import React from 'react';
import { useDrop } from 'react-dnd';
import emoji from 'react-easy-emoji';
import { PiGearFineBold } from 'react-icons/pi';
import { NavLink } from 'react-router-dom';
import { createPlaylistNavigate } from 'scripts/navigate-generators';
import { allSelectObservables, store } from 'state';
import { DragTypes, SelectObservable, SelectObservables } from 'typescript';

const ReactiveDrawer = reactive(Drawer);

const PlaylistListItem: React.FC<{
  index: number;
  playlist: Playlist;
  state: SelectObservable;
}> = ({ index, playlist, state }) => {
  const isSelected = useSelector(() => state.selectedIndexes.get().includes(index));

  const handleClick = () => {
    setTimeout(() => store.ui.drawers.playlists.open.toggle(), 300);
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.ALBUM, DragTypes.ARTIST, DragTypes.PLAYLIST_ITEM, DragTypes.TRACK],
      drop: (items: Album[] | Artist[] | PlaylistItem[] | Track[]) => {
        let ids: number[];
        if (items.every((item) => isPlaylistItem(item))) {
          ids = items.map((item) => item.track.id);
        } else {
          ids = items.map((item: Album | Artist | Track) => item.id);
        }
        playlistActions.addToPlaylist(playlist.id, ids);
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [playlist]
  );

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    state.selectedIndexes.set([index]);
    store.ui.menus.anchorPosition.set({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  return (
    <NavLink
      className="playlist-link"
      ref={playlist.smart ? null : drop}
      to={createPlaylistNavigate(playlist)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {({ isActive }) => (
        <ListItem
          sx={(theme) => ({
            background: isSelected ? theme.palette.action.selected : 'transparent',
            border: '1px solid',
            borderColor: isOver ? theme.palette.primary.main : 'transparent',
            borderRadius: '4px',
            color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
            fontWeight: isActive ? 700 : 400,
            '&:hover': {
              color: theme.palette.text.primary,
            },
          })}
        >
          <Show if={isActive}>
            <Box bgcolor="primary.main" borderRadius={2} height={16} marginRight={0.5} width={4} />
          </Show>
          <ListItemText>{emoji(playlist.title)}</ListItemText>
          <Show if={playlist.smart}>
            <Box color="#8e6191" flexShrink={0} height={16} width={16}>
              <PiGearFineBold />
            </Box>
          </Show>
        </ListItem>
      )}
    </NavLink>
  );
};

const Playlists: React.FC = observer(function Playlists() {
  const selectObservable = allSelectObservables[SelectObservables.DRAWER_PLAYLISTS];
  const playlists = store.playlists.currentPlaylists.get();
  return (
    <Scroller>
      <ClickAwayListener
        onClickAway={(event) => selectActions.handleClickAway(selectObservable, event)}
      >
        <List
          onMouseOver={() => {
            store.ui.menus.activeMenu.set(SelectObservables.DRAWER_PLAYLISTS);
            selectObservable.items.set(playlists.playlists);
          }}
        >
          {playlists.playlists.map((playlist, index) => (
            <PlaylistListItem
              index={index}
              key={playlist.id}
              playlist={playlist}
              state={selectObservable}
            />
          ))}
        </List>
      </ClickAwayListener>
    </Scroller>
  );
});

const PlaylistsDrawer: React.FC = () => {
  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-invisible')) {
      return;
    }
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.playlists.open.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.playlists.open.get()} anchor="right">
      <ClickAwayListener onClickAway={handleClose}>
        <Box display="flex" flexDirection="column" height={1}>
          <Typography paddingX={1} variant="h5">
            Playlists
          </Typography>
          <Playlists />
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default PlaylistsDrawer;
