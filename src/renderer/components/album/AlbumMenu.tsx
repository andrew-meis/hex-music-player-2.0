import { Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Album } from 'api';
import { playbackActions } from 'features/playback';
import { queueActions } from 'features/queue';
import React from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { CgRowFirst, CgRowLast } from 'react-icons/cg';
import { FiRadio } from 'react-icons/fi';
import { MdMusicOff } from 'react-icons/md';
import { RiShuffleFill } from 'react-icons/ri';
import { useSearchParams } from 'react-router-dom';
import { persistedStore, store } from 'state';
import { CustomFilterKeys, ReleaseFilters } from 'typescript';

const AlbumMenu: React.FC<{ albums: Album[] }> = ({ albums }) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const handlePlay = (shuffle = false) => {
    playbackActions.playLibraryItems(albums, shuffle);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handlePlayRadio = () => {
    playbackActions.playAlbumRadio(albums[0]);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handleAddToQueue = (next = false) => {
    const queueId = persistedStore.queueId.peek();
    if (queueId === 0) {
      playbackActions.playLibraryItems(albums);
    } else {
      queueActions.addToQueue(albums, undefined, undefined, next);
    }
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handleHideRelease = async () => {
    const guid = searchParams.get('guid');
    if (!guid) return;
    const filters = await window.api.getValue('release-filters');
    if (!filters) {
      const newFilters: ReleaseFilters = [{ guid, exclusions: [albums[0].guid] }];
      await window.api.setValue('release-filters', newFilters);
    }
    if (filters) {
      const index = filters.findIndex((value) => value.guid === guid);
      if (index > -1) {
        const updatedExclusions = [...filters[index].exclusions, albums[0].guid];
        filters[index] = { guid, exclusions: updatedExclusions };
      }
      if (index === -1) {
        filters.push({ guid, exclusions: [albums[0].guid] });
      }
      await window.api.setValue('release-filters', filters);
    }
    await queryClient.invalidateQueries({
      predicate: (query) =>
        Object.values(CustomFilterKeys).includes(query.queryKey[0] as CustomFilterKeys),
    });
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  return (
    <>
      <MenuItem onClick={() => handlePlay()}>
        <ListItemIcon>
          <BsPlayFill />
        </ListItemIcon>
        <ListItemText>Play now</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handlePlay(true)}>
        <ListItemIcon sx={{ fontSize: '1.15rem' }}>
          <RiShuffleFill />
        </ListItemIcon>
        <ListItemText>Shuffle</ListItemText>
      </MenuItem>
      {albums.length === 1 && (
        <MenuItem onClick={handlePlayRadio}>
          <ListItemIcon sx={{ fontSize: '1.15rem' }}>
            <FiRadio viewBox="0 -1 24 24" />
          </ListItemIcon>
          <ListItemText>Play album radio</ListItemText>
        </MenuItem>
      )}
      <MenuItem onClick={() => handleAddToQueue(true)}>
        <ListItemIcon>
          <CgRowFirst />
        </ListItemIcon>
        <ListItemText>Play next</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleAddToQueue()}>
        <ListItemIcon>
          <CgRowLast />
        </ListItemIcon>
        <ListItemText>Add to queue</ListItemText>
      </MenuItem>
      {albums.length === 1 && albums[0].subformat.find((value) => value.tag === 'appearance') && (
        <>
          <Divider sx={{ margin: '4px !important' }} />
          <MenuItem
            sx={{ '&:hover': { background: 'rgba(var(--mui-palette-error-mainChannel) / 0.5)' } }}
            onClick={() => handleHideRelease()}
          >
            <ListItemIcon>
              <MdMusicOff />
            </ListItemIcon>
            <ListItemText>Hide release</ListItemText>
          </MenuItem>
        </>
      )}
    </>
  );
};

export default AlbumMenu;
