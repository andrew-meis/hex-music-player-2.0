import { Avatar, Box, Typography } from '@mui/joy';
import { Album } from 'api';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { createAlbumNavigate, createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

import Result from './Result';

const AlbumResult: React.FC<{ album: Album }> = ({ album }) => {
  const library = store.library.get();
  const navigate = useNavigate();

  const thumbSrc = library.resizeImage({ url: album.thumb, width: 64, height: 64 });

  const handleNavigate = () => {
    navigate(createAlbumNavigate(album));
  };

  const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <Result onClick={handleNavigate}>
      <Avatar
        alt={album.title}
        src={thumbSrc}
        sx={{ borderRadius: 4, height: 48, marginX: 1, width: 48 }}
      >
        <BiSolidAlbum />
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" level="title-md" lineHeight={1.2}>
          {album.title}
        </Typography>
        <Typography level="title-sm">
          {album.type}
          &nbsp; · &nbsp;
          <Link
            className="link"
            to={createArtistNavigate(album)}
            onClick={(event) => handleLink(event)}
          >
            {album.parentTitle}
          </Link>
        </Typography>
      </Box>
    </Result>
  );
};

export default AlbumResult;
