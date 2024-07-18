import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Playlist } from 'api';
import chroma from 'chroma-js';
import CardBox from 'components/card/CardBox';
import CardFab from 'components/card/CardFab';
import { playbackActions } from 'features/playback';
import React from 'react';
import { BsMusicNoteList } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { createPlaylistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';
import { SelectObservable } from 'typescript';

const defaultColor = chroma('#848588');

const PlaylistCard: React.FC<{ playlist: Playlist; index: number; state: SelectObservable }> =
  observer(function PlaylistCard({ playlist, index, state }) {
    const library = store.library.get();

    const navigate = useNavigate();

    const thumbSrc = useSelector(() => {
      return library.resizeImage(
        new URLSearchParams({
          url: playlist.thumb || playlist.composite,
          width: '500',
          height: '500',
        })
      );
    });

    const thumbBlurred = useSelector(() => {
      return library.resizeImage(
        new URLSearchParams({
          url: playlist.thumb || playlist.composite,
          width: '40',
          height: '40',
          blur: '10',
        })
      );
    });

    const isSelected = useSelector(() => state.selectedIndexes.get().includes(index));

    const handleContextMenu = (event: React.MouseEvent) => {
      event.preventDefault();
      if (!isSelected) {
        state.selectedIndexes.set([index]);
      }
      store.ui.menus.anchorPosition.set({
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 6,
      });
    };

    return (
      <CardBox
        onClick={(event) => {
          event.stopPropagation();
          navigate(createPlaylistNavigate(playlist));
        }}
        onContextMenu={handleContextMenu}
      >
        <div
          style={{
            aspectRatio: 1,
            backgroundImage: `url(${thumbSrc})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: 4,
            margin: 8,
            marginTop: 20,
          }}
        >
          <div
            style={{
              backgroundColor: defaultColor.css(),
              backgroundImage: `url(${thumbBlurred})`,
              backgroundPosition: 'center top',
              backgroundSize: 'cover',
              opacity: 0.75,
              width: 'calc(100% - 8px)',
              height: 6,
              position: 'relative',
              top: -7,
              margin: 'auto',
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          />
          <div
            style={{
              backgroundColor: defaultColor.css(),
              backgroundImage: `url(${thumbBlurred})`,
              backgroundPosition: 'center top',
              backgroundSize: 'cover',
              opacity: 0.5,
              width: 'calc(100% - 16px)',
              height: 4,
              position: 'relative',
              top: -18,
              margin: 'auto',
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          />
          {!thumbSrc && (
            <Avatar sx={{ height: 1, width: 1, top: -10 }} variant="rounded">
              <SvgIcon className="generic-icon">
                <BsMusicNoteList />
              </SvgIcon>
            </Avatar>
          )}
        </div>
        <CardFab
          onClick={(event) => {
            event.stopPropagation();
            playbackActions.playPlaylist(playlist, false);
          }}
        />
        <Box margin={1} marginBottom={2}>
          <Typography variant="title1">{playlist.title}</Typography>
          <Typography color="text.secondary" variant="title2">
            {`${playlist.leafCount} ${playlist.leafCount === 1 ? 'track' : 'tracks'}`}
          </Typography>
        </Box>
      </CardBox>
    );
  });

export default PlaylistCard;
