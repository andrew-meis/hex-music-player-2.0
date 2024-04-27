import { observer } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Artist } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { IoMdMicrophone } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const ArtistRow: React.FC<{ artist: Artist }> = observer(function ArtistRow({ artist }) {
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
    <Row onClick={handleNavigate}>
      <Avatar alt={artist.title} src={thumbSrc} sx={{ height: 48, marginX: 1, width: 48 }}>
        <SvgIcon>
          <IoMdMicrophone />
        </SvgIcon>
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" lineHeight={1.2} variant="body1">
          {artist.title}
        </Typography>
        <Typography variant="subtitle2">
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
    </Row>
  );
});

export default ArtistRow;
