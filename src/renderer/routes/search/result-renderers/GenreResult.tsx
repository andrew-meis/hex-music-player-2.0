import { Avatar, Box, SvgIcon, Typography } from '@mui/joy';
import { Genre } from 'api';
import React from 'react';
import { FaTags } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createGenreNavigate } from 'scripts/navigate-generators';

import Result from './Result';

const GenreResult: React.FC<{ genre: Genre }> = ({ genre }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(createGenreNavigate(genre));
  };

  return (
    <Result onClick={handleNavigate}>
      <Avatar alt={genre.title} sx={{ borderRadius: 4, height: 48, marginX: 1, width: 48 }}>
        <SvgIcon>
          <FaTags />
        </SvgIcon>
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" level="title-md" lineHeight={1.2}>
          {genre.title}
        </Typography>
        <Typography level="title-sm">genre</Typography>
      </Box>
    </Result>
  );
};

export default GenreResult;
