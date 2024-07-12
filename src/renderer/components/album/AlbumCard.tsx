import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Album } from 'api';
import CardBox from 'components/card/CardBox';
import CardFab from 'components/card/CardFab';
import { playbackActions } from 'features/playback';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { createAlbumNavigate } from 'scripts/navigate-generators';
import { store } from 'state';
import { SelectObservable } from 'typescript';

const AlbumCard: React.FC<{ album: Album; index: number; state: SelectObservable }> = observer(
  function AlbumCard({ album, index, state }) {
    const library = store.library.get();

    const navigate = useNavigate();

    const albumThumbSrc = useSelector(() => {
      return library.resizeImage(
        new URLSearchParams({ url: album.thumb, width: '500', height: '500' })
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
          navigate(createAlbumNavigate(album));
        }}
        onContextMenu={handleContextMenu}
      >
        <div
          style={{
            aspectRatio: 1,
            backgroundImage: `url(${albumThumbSrc})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: 4,
            margin: 8,
          }}
        >
          {!albumThumbSrc && (
            <Avatar sx={{ height: 1, width: 1 }} variant="rounded">
              <SvgIcon className="generic-icon">
                <BiSolidAlbum />
              </SvgIcon>
            </Avatar>
          )}
        </div>
        <CardFab
          onClick={(event) => {
            event.stopPropagation();
            playbackActions.playLibraryItems([album], false);
          }}
        />
        <Box margin={1} marginBottom={2}>
          <Typography variant="title1">{album.title}</Typography>
          <Typography color="text.secondary" variant="title2">
            {album.year}
          </Typography>
        </Box>
      </CardBox>
    );
  }
);

export default AlbumCard;
