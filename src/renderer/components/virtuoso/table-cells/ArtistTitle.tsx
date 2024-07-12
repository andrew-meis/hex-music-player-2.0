import { Show } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import { Artist } from 'api';
import React from 'react';
import { Link } from 'react-router-dom';
import { createArtistNavigate } from 'scripts/navigate-generators';

const ArtistTitle: React.FC<{ showSubtext?: boolean; showType?: boolean; artist: Artist }> = ({
  showSubtext = true,
  showType = false,
  artist,
}) => {
  return (
    <Box>
      <Typography variant="title1">
        <Link
          className="link"
          to={createArtistNavigate(artist)}
          onClick={(event) => event.stopPropagation()}
        >
          {artist.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography variant="title2">
          {showType ? `${artist._type}\xa0 · \xa0` : ''}
          <Link
            className="link"
            to={createArtistNavigate(artist, 'discography')}
            onClick={(event) => event.stopPropagation()}
          >
            {artist.childCount > 1
              ? `${artist.childCount} releases`
              : `${artist.childCount} release`}
          </Link>
        </Typography>
      </Show>
    </Box>
  );
};

export default ArtistTitle;
