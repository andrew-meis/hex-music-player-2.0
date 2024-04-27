import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Genre } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { FaTags } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createGenreNavigate } from 'scripts/navigate-generators';

const GenreRow: React.FC<{ genre: Genre }> = ({ genre }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(createGenreNavigate(genre));
  };

  return (
    <Row onClick={handleNavigate}>
      <Avatar alt={genre.title} sx={{ height: 48, marginX: 1, width: 48 }} variant="rounded">
        <SvgIcon>
          <FaTags />
        </SvgIcon>
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" lineHeight={1.2} variant="body1">
          {genre.title}
        </Typography>
        <Typography variant="subtitle2">genre</Typography>
      </Box>
    </Row>
  );
};

export default GenreRow;
