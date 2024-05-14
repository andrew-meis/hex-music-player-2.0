import { observer } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Artist } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { IoMdMicrophone } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const ArtistRow: React.FC<{ artist: Artist; index: number }> = observer(function ArtistRow({
  artist,
  index,
}) {
  const library = store.library.get();

  const thumbSrc = library.resizeImage(
    new URLSearchParams({ url: artist.thumb, width: '64', height: '64' })
  );

  const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <Row index={index}>
      <Avatar alt={artist.title} src={thumbSrc} sx={{ height: 48, marginX: 1, width: 48 }}>
        <SvgIcon>
          <IoMdMicrophone />
        </SvgIcon>
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" lineHeight={1.2} variant="body1">
          <Link
            className="link"
            to={createArtistNavigate(artist)}
            onClick={(event) => handleLink(event)}
          >
            {artist.title}
          </Link>
        </Typography>
        <Typography variant="subtitle1">
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
