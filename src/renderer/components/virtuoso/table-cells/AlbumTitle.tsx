import { Show } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
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
    <Box>
      <Typography fontFamily="Rubik" lineHeight={1.25} variant="body1">
        <Link
          className="link"
          to={createAlbumNavigate(album)}
          onClick={(event) => event.stopPropagation()}
        >
          {album.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography lineHeight={1.25} variant="subtitle1">
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
    </Box>
  );
};

export default AlbumTitle;
