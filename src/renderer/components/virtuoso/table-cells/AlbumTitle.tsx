import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { Album } from 'api';
import React from 'react';
import { Link } from 'react-router-dom';
import { createAlbumNavigate, createArtistNavigate } from 'scripts/navigate-generators';

const AlbumTitle: React.FC<{ showSubtext?: boolean; showType?: boolean; album: Album }> = ({
  showSubtext = true,
  showType = false,
  album,
}) => {
  return (
    <>
      <Typography variant="title1">
        <Link
          className="link"
          to={createAlbumNavigate(album)}
          onClick={(event) => event.stopPropagation()}
        >
          {album.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography variant="title2">
          {showType ? `${album._type}\xa0 · \xa0` : ''}
          <Link
            className="link"
            to={createArtistNavigate(album)}
            onClick={(event) => event.stopPropagation()}
          >
            {album.parentTitle}
          </Link>
        </Typography>
      </Show>
    </>
  );
};

export default AlbumTitle;
