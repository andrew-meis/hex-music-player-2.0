import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Genre } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { createGenreNavigate } from 'scripts/navigate-generators';

const GenreRow: React.FC<{ genre: Genre; index: number }> = ({ genre, index }) => {
  const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <Row index={index}>
      <Avatar alt={genre.title} sx={{ height: 48, marginX: 1, width: 48 }} variant="rounded">
        <SvgIcon>
          <FaTags />
        </SvgIcon>
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" lineHeight={1.2} variant="body1">
          <Link
            className="link"
            to={createGenreNavigate(genre)}
            onClick={(event) => handleLink(event)}
          >
            {genre.title}
          </Link>
        </Typography>
        <Typography variant="subtitle1">genre</Typography>
      </Box>
    </Row>
  );
};

export default GenreRow;
