import { Show } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
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
    <Box>
      <Typography fontFamily="Rubik" lineHeight={1.25} variant="body1">
        <Link
          className="link"
          to={createGenreNavigate(genre)}
          onClick={(event) => event.stopPropagation()}
        >
          {genre.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography lineHeight={1.25} variant="subtitle1">
          {showType ? `${genre._type}` : ''}
        </Typography>
      </Show>
    </Box>
  );
};

export default GenreTitle;
