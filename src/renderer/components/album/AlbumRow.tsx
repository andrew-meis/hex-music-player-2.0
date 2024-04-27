import { observer } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/material';
import { Album } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { createAlbumNavigate, createArtistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const AlbumRow: React.FC<{ album: Album }> = observer(function AlbumRow({ album }) {
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
    <Row onClick={handleNavigate}>
      <Avatar
        alt={album.title}
        src={thumbSrc}
        sx={{ height: 48, marginX: 1, width: 48 }}
        variant="rounded"
      >
        <BiSolidAlbum />
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik" lineHeight={1.2} variant="body1">
          {album.title}
        </Typography>
        <Typography variant="subtitle2">
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
    </Row>
  );
});

export default AlbumRow;
