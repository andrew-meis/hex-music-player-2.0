import { Avatar, Box, SvgIcon, Typography } from '@mui/joy';
import { Artist } from 'api';
import React from 'react';
import { IoMdMicrophone } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

import Result from './Result';

const ArtistResult: React.FC<{ artist: Artist }> = ({ artist }) => {
  const library = store.library.get();
  const navigate = useNavigate();

  const thumbSrc = library.resizeImage({ url: artist.thumb, width: 64, height: 64 });

  const handleNavigate = () => {
    navigate(createArtistNavigate(artist));
  };

  const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <Result onClick={handleNavigate}>
      <Avatar alt={artist.title} src={thumbSrc} sx={{ height: 48, marginX: 1, width: 48 }}>
        <SvgIcon>
          <IoMdMicrophone />
        </SvgIcon>
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" level="title-md" lineHeight={1.2}>
          {artist.title}
        </Typography>
        <Typography level="title-sm">
          {artist.type}
          &nbsp; · &nbsp;
          <Link
            className="link"
            to={createArtistNavigate(artist, 'discography')}
            onClick={(event) => handleLink(event)}
          >
            {artist.childCount > 1
              ? `${artist.childCount} releases`
              : `${artist.childCount} release`}
          </Link>
        </Typography>
      </Box>
    </Result>
  );
};

export default ArtistResult;
