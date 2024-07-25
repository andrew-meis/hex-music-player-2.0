import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Album } from 'api';
import CardBox from 'components/card/CardBox';
import CardFab from 'components/card/CardFab';
import { playbackActions } from 'features/playback';
import { selectActions } from 'features/select';
import { DateTime } from 'luxon';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import formatCount from 'scripts/format-count';
import { createAlbumNavigate, createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';
import { SelectObservable } from 'typescript';

const Artist: React.FC<{ album: Album }> = ({ album }) => (
  <Link
    className="link"
    to={createArtistNavigate(album)}
    onClick={(event) => event.stopPropagation()}
  >
    {album.parentTitle}
  </Link>
);

const getSubtext = (key: keyof Album, album: Album) => {
  const elements = {
    addedAt: album.addedAt
      ? DateTime.fromJSDate(album.addedAt).toLocaleString(DateTime.DATE_FULL)
      : 'no added at',
    lastViewedAt: album.lastViewedAt
      ? DateTime.fromJSDate(album.lastViewedAt).toRelative()
      : 'unplayed',
    originallyAvailableAt: album.originallyAvailableAt
      ? DateTime.fromJSDate(album.originallyAvailableAt!).year
      : 'no release date',
    parentTitle: <Artist album={album} />,
    title: <Artist album={album} />,
    viewCount: formatCount(album.viewCount, 'play', 'unplayed'),
  } as Record<keyof Album, React.ReactNode>;
  return elements[key];
};

const AlbumCard: React.FC<{
  album: Album;
  index: number;
  state: SelectObservable;
  subtext: keyof Album;
}> = observer(function AlbumCard({ album, index, state, subtext }) {
  const library = store.library.get();

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
      bgcolor={isSelected ? 'action.selected' : 'transparent'}
      sx={{
        '&:hover': {
          backgroundColor: isSelected ? 'action.hoverSelected' : 'action.hover',
        },
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        selectActions.handleSelect(event, index, state)
      }
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
        <Typography variant="title1">
          <Link
            className="link"
            to={createAlbumNavigate(album)}
            onClick={(event) => event.stopPropagation()}
          >
            {album.title}
          </Link>
        </Typography>
        <Typography color="text.secondary" variant="title2">
          {getSubtext(subtext, album)}
        </Typography>
      </Box>
    </CardBox>
  );
});

export default AlbumCard;
