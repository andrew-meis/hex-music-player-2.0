import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { Genre } from 'api';
import React from 'react';
import { Link } from 'react-router-dom';
import { createGenreNavigate } from 'scripts/navigate-generators';

const GenreTitle: React.FC<{
  showSubtext?: boolean;
  showType?: boolean;
  genre: Genre;
}> = ({ showSubtext = true, showType = false, genre }) => {
  return (
    <>
      <Typography variant="title1">
        <Link
          className="link"
          to={createGenreNavigate(genre)}
          onClick={(event) => event.stopPropagation()}
        >
          {genre.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography variant="title2">{showType ? `${genre._type}` : ''}</Typography>
      </Show>
    </>
  );
};

export default GenreTitle;
