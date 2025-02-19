import {
  observer,
  reactive,
  Show,
  useComputed,
  useObservable,
  useSelector,
} from '@legendapp/state/react';
import {
  Box,
  BoxProps,
  ClickAwayListener,
  Collapse,
  CollapseProps,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { Album, Artist, isPlaylistItem, Playlist, PlaylistItem, Track } from 'api';
import EditFab from 'components/edit/EditFab';
import Scroller from 'components/scroller/Scroller';
import { playlistActions } from 'features/playlist';
import { uniq } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import emoji from 'react-easy-emoji';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';
import { HiHeart } from 'react-icons/hi2';
import { MdClear } from 'react-icons/md';
import { PiGearFineBold } from 'react-icons/pi';
import { TbEdit, TbFolder, TbFolderPlus, TbPinned, TbTrash } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';
import { createPlaylistNavigate } from 'scripts/navigate-generators';
import { allSelectObservables, persistedStore, store } from 'state';
import { DragTypes, PlaylistFolder, SelectObservable, SelectObservables } from 'typescript';

const ReactiveDrawer = reactive(Drawer);
const ReactiveTextField = reactive(TextField);

export const isPlaylistFolder = (x: any): x is PlaylistFolder => x._type === 'playlist-folder';

export const PlaylistFolderMenu: React.FC<{ playlistsFolders: PlaylistFolder[] }> = ({
  playlistsFolders,
}) => {
  const handleEdit = () => {
    store.ui.modals.values.folder.set({ action: 'edit', currentName: playlistsFolders[0].title });
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handleDelete = () => {
    persistedStore.playlistFolders[playlistsFolders[0].title].delete();
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  return (
    <>
      <MenuItem onClick={handleEdit}>
        <ListItemIcon>
          <TbEdit />
        </ListItemIcon>
        <ListItemText>Edit folder</ListItemText>
      </MenuItem>
      <Divider sx={{ margin: '4px !important' }} />
      <MenuItem
        sx={{ '&:hover': { background: 'rgba(var(--mui-palette-error-mainChannel) / 0.5)' } }}
        onClick={handleDelete}
      >
        <ListItemIcon sx={{ fontSize: '1.2rem' }}>
          <TbTrash />
        </ListItemIcon>
        <ListItemText>Delete folder</ListItemText>
      </MenuItem>
    </>
  );
};

export const EditPlaylistFolder: React.FC<{ action: 'edit' | 'new'; currentName: string }> = ({
  action,
  currentName,
}) => {
  const value = useObservable(currentName);

  const isValid = useComputed(() => {
    const folders = persistedStore.playlistFolders.get();
    const newName = value.get().trim();
    if (Object.keys(folders).includes(newName)) return false;
    return true;
  });

  const handleButtonClick = () => {
    const newName = value.get();
    if (action === 'edit') {
      if (currentName === newName) return;
      persistedStore.playlistFolders[newName].set(
        persistedStore.playlistFolders[currentName].get()
      );
      persistedStore.playlistFolders[currentName].delete();
    } else if (action === 'new') {
      persistedStore.playlistFolders[value.get()].set([]);
    }
    setTimeout(() => store.ui.modals.open.set(false), 300);
  };

  if (!currentName) return null;

  return (
    <Box display="flex" flexDirection="column" height="-webkit-fill-available" margin={2} width={1}>
      <Box alignItems="center" display="flex" justifyContent="space-between" paddingBottom={1}>
        <Typography variant="h4">Edit Folder</Typography>
        <IconButton onClick={() => store.ui.modals.open.set(false)}>
          <SvgIcon>
            <MdClear />
          </SvgIcon>
        </IconButton>
      </Box>
      <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
        Folder Name
      </Typography>
      <ReactiveTextField
        $value={value}
        sx={{
          left: '-0.5rem',
          width: 'calc(100% + 1rem)',
        }}
        variant="standard"
        onChange={(event) => value.set(event.target.value)}
      />
      <EditFab isVisible={isValid} onClick={handleButtonClick} />
    </Box>
  );
};

const CurrentFavoritesListItem: React.FC = () => {
  const handleClick = () => {
    setTimeout(() => store.ui.drawers.playlists.open.toggle(), 300);
  };

  return (
    <NavLink className="playlist-link" to="/current-favorites" onClick={handleClick}>
      {({ isActive }) => (
        <ListItem
          sx={(theme) => ({
            color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
            fontWeight: isActive ? 700 : 400,
            '&:hover': {
              color: theme.palette.text.primary,
            },
          })}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <TbPinned />
          </ListItemIcon>
          <Show if={isActive}>
            <Box bgcolor="primary.main" borderRadius={2} height={16} marginRight={0.5} width={4} />
          </Show>
          <ListItemText>Current Favorites</ListItemText>
          <Box
            color="var(--mui-palette-error-main)"
            flexShrink={0}
            height={16}
            marginRight={0.5}
            width={16}
          >
            <HiHeart />
          </Box>
        </ListItem>
      )}
    </NavLink>
  );
};

const PlaylistListItem: React.FC<{
  inFolder?: boolean;
  index: number;
  playlist: Playlist;
  state: SelectObservable;
}> = ({ inFolder = false, index, playlist, state }) => {
  const isSelected = useSelector(() => state.selectedIndexes.get().includes(index));

  const handleClick = () => {
    setTimeout(() => store.ui.drawers.playlists.open.toggle(), 300);
  };

  const [, drag, dragPreview] = useDrag(
    () => ({
      item: () => state.selectedItems.peek(),
      type: DragTypes.PLAYLIST,
      end: () => {
        store.ui.queue.isOverIndex.set(-1);
        state.selectedIndexes.set([]);
      },
    }),
    []
  );

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

  const handleDragStart = () => {
    if (state.selectedIndexes.peek().includes(index)) return;
    state.selectedIndexes.set([index]);
  };

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

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
          ref={drag}
          sx={(theme) => ({
            background: isSelected ? theme.palette.action.selected : 'transparent',
            border: '1px solid',
            borderColor: isOver ? theme.palette.primary.main : 'transparent',
            borderRadius: '4px',
            color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
            fontWeight: isActive ? 700 : 400,
            paddingLeft: inFolder ? 2 : 1,
            '&:hover': {
              color: theme.palette.text.primary,
            },
          })}
          onDragStart={handleDragStart}
        >
          <Show if={isActive}>
            <Box bgcolor="primary.main" borderRadius={2} height={16} marginRight={0.5} width={4} />
          </Show>
          <ListItemText>{emoji(playlist.title)}</ListItemText>
          <Show if={playlist.smart}>
            <Box color="#8e6191" flexShrink={0} height={16} marginRight={0.5} width={16}>
              <PiGearFineBold />
            </Box>
          </Show>
        </ListItem>
      )}
    </NavLink>
  );
};

const removefromFolder = (id: number, title: string) => {
  persistedStore.playlistFolders[title].set((prev) => prev.filter((x) => x !== id));
};

const addToFolder = (id: number, title: string) => {
  const folders = persistedStore.playlistFolders.get();
  if (folders[title].includes(id)) return;
  const entry = Object.keys(folders).find((key) => folders[key].includes(id));
  if (entry) {
    removefromFolder(id, entry);
  }
  persistedStore.playlistFolders[title].set((prev) => uniq([...prev, id]));
};

const FolderedPlaylists: React.FC<
  {
    folderIndex: number;
    indexes: Record<string, number>;
    playlists: Playlist[];
    state: SelectObservable;
    title: string;
  } & CollapseProps
> = ({ folderIndex, indexes, playlists, state, title, onMouseOver }) => {
  const selectObservable = allSelectObservables[SelectObservables.DRAWER_PLAYLISTS];
  const [open, setOpen] = useState(false);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.PLAYLIST],
      drop: (items: Playlist[]) => addToFolder(items[0].id, title),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [playlists]
  );

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    state.selectedIndexes.set([folderIndex]);
    store.ui.menus.anchorPosition.set({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  return (
    <>
      <ListItem
        ref={drop}
        sx={(theme) => ({
          border: '1px solid',
          borderColor: isOver ? theme.palette.primary.main : 'transparent',
          borderRadius: '4px',
          cursor: 'pointer',
          color: open ? theme.palette.text.primary : theme.palette.text.secondary,
          fontWeight: open ? 700 : 400,
          '&:hover': {
            color: theme.palette.text.primary,
          },
        })}
        onClick={() => setOpen(!open)}
        onContextMenu={handleContextMenu}
        onDragEnter={() => setTimeout(() => setOpen(true), 300)}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>
          <TbFolder />
        </ListItemIcon>
        <ListItemText>{title}</ListItemText>
        <Box alignItems="center" display="flex" marginLeft="auto" marginRight={0.5}>
          {open ? <FaCaretDown /> : <FaCaretRight />}
        </Box>
      </ListItem>
      <Collapse in={open} timeout="auto" onMouseOver={onMouseOver}>
        {playlists.map((playlist) => (
          <PlaylistListItem
            inFolder
            index={indexes[playlist.id]}
            key={playlist.id}
            playlist={playlist}
            state={selectObservable}
          />
        ))}
      </Collapse>
    </>
  );
};

const UnfolderedPlaylists: React.FC<
  {
    folders: Record<string, number[]>;
    indexes: Record<string, number>;
    playlists: Playlist[];
  } & BoxProps
> = ({ folders, indexes, playlists, onMouseOver }) => {
  const selectObservable = allSelectObservables[SelectObservables.DRAWER_PLAYLISTS];

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.PLAYLIST],
      drop: (items: Playlist[]) => {
        const folder = Object.keys(folders).find((key) => folders[key].includes(items[0].id));
        if (folder) {
          removefromFolder(items[0].id, folder);
        }
      },
      canDrop: (items: Playlist[]) => {
        if (Object.values(folders).flat().includes(items[0].id)) return true;
        return false;
      },
      collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() }),
    }),
    [folders, indexes, playlists]
  );

  return (
    <Box
      ref={drop}
      sx={(theme) => ({
        border: '1px solid',
        borderColor: isOver && canDrop ? theme.palette.primary.main : 'transparent',
        borderRadius: '4px',
      })}
      onMouseOver={onMouseOver}
    >
      {playlists.map((playlist) => (
        <PlaylistListItem
          index={indexes[playlist.id]}
          key={playlist.id}
          playlist={playlist}
          state={selectObservable}
        />
      ))}
    </Box>
  );
};

const Playlists: React.FC = observer(function Playlists() {
  const selectObservable = allSelectObservables[SelectObservables.DRAWER_PLAYLISTS];
  const selectObservableFolders = allSelectObservables[SelectObservables.DRAWER_PLAYLISTS_FOLDERS];
  const playlists = store.playlists.currentPlaylists.playlists.get();
  const folders = persistedStore.playlistFolders.get();

  const indexes = useSelector(() => {
    const playlists = store.playlists.currentPlaylists.playlists.get();
    return Object.fromEntries(playlists.map((value, index) => [value.id, index]));
  });

  const folderArray: PlaylistFolder[] = useSelector(() => {
    const folders = persistedStore.playlistFolders.get();
    return Object.entries(folders).map(([key], index) => ({
      id: index,
      title: key,
      _type: 'playlist-folder',
    }));
  });

  const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    store.ui.menus.activeMenu.set(SelectObservables.DRAWER_PLAYLISTS);
    selectObservable.items.set(playlists);
  };

  return (
    <Scroller>
      <List>
        <CurrentFavoritesListItem />
        <Box
          onMouseOver={(event) => {
            event.stopPropagation();
            store.ui.menus.activeMenu.set(SelectObservables.DRAWER_PLAYLISTS_FOLDERS);
            selectObservableFolders.items.set(folderArray);
          }}
        >
          {Object.entries(folders).map(([key, value], index) => (
            <FolderedPlaylists
              folderIndex={index}
              indexes={indexes}
              key={key}
              playlists={playlists.filter((playlist) => value.includes(playlist.id))}
              state={selectObservableFolders}
              title={key}
              onMouseOver={handleMouseOver}
            />
          ))}
        </Box>
        <Show
          ifReady={playlists.filter((playlist) => {
            if (Object.values(folders).flat().includes(playlist.id)) return false;
            return true;
          })}
        >
          {(value) => {
            if (!value) return;
            return (
              <UnfolderedPlaylists
                folders={folders}
                indexes={indexes}
                playlists={value}
                onMouseOver={handleMouseOver}
              />
            );
          }}
        </Show>
      </List>
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
          <Box alignItems="center" display="flex" paddingRight={1}>
            <Typography marginRight="auto" paddingX={1} variant="h5">
              Playlists
            </Typography>
            <IconButton
              sx={{ height: 32, width: 32 }}
              onClick={() =>
                store.ui.modals.values.folder.set({ action: 'new', currentName: 'New folder' })
              }
            >
              <TbFolderPlus />
            </IconButton>
          </Box>
          <Playlists />
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default PlaylistsDrawer;
