import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { Artist } from 'api';
import React from 'react';
import { Link } from 'react-router-dom';
import { createArtistNavigate } from 'scripts/navigate-generators';

const ArtistTitle: React.FC<{
  showArtistType?: boolean;
  showDefaultSubtext?: boolean;
  showType?: boolean;
  artist: Artist;
}> = ({ showDefaultSubtext = true, showType = false, showArtistType = false, artist }) => {
  return (
    <>
      <Typography variant="title1">
        <Link
          className="link"
          to={createArtistNavigate(artist)}
          onClick={(event) => event.stopPropagation()}
        >
          {artist.title}
        </Link>
      </Typography>
      <Show if={showDefaultSubtext}>
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
      <Show if={showArtistType}>
        <Typography variant="title2">{artist.type}</Typography>
      </Show>
    </>
  );
};

export default ArtistTitle;
