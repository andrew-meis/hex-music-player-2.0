import { Avatar, Box, Typography } from '@mui/joy';
import { Track } from 'api';
import React from 'react';
import { IoMusicalNotes } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import {
  createAlbumNavigate,
  createArtistNavigate,
  createTrackNavigate,
} from 'scripts/navigate-generators';
import { store } from 'state';

import Result from './Result';

const TrackResult: React.FC<{ track: Track }> = ({ track }) => {
  const library = store.library.get();
  const navigate = useNavigate();

  const thumbSrc = library.resizeImage({ url: track.thumb, width: 64, height: 64 });

  const handleNavigate = () => {
    navigate(createTrackNavigate(track));
  };

  const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <Result onClick={handleNavigate}>
      <Avatar
        alt={track.title}
        src={thumbSrc}
        sx={{ borderRadius: 4, height: 48, marginX: 1, width: 48 }}
      >
        <IoMusicalNotes />
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" level="title-md" lineHeight={1.2}>
          {track.title}
        </Typography>
        <Typography level="title-sm">
          {track._type}
          &nbsp; · &nbsp;
          <Link
            className="link"
            to={createArtistNavigate(track)}
            onClick={(event) => handleLink(event)}
          >
            {track.originalTitle ? track.originalTitle : track.grandparentTitle}
          </Link>
          &nbsp; — &nbsp;
          <Link
            className="link"
            to={createAlbumNavigate(track)}
            onClick={(event) => handleLink(event)}
          >
            {track.parentTitle}
          </Link>
        </Typography>
      </Box>
    </Result>
  );
};

export default TrackResult;
