import { observer } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/material';
import { Track } from 'api';
import { queueActions } from 'audio';
import Row, { RowOptions } from 'components/row/Row';
import React from 'react';
import { IoMusicalNotes } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import {
  createAlbumNavigate,
  createArtistNavigate,
  createTrackNavigate,
} from 'scripts/navigate-generators';
import { store } from 'state';

const TrackRow: React.FC<{ options?: RowOptions; track: Track }> = observer(function TrackRow({
  options,
  track,
}) {
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
    <Row
      onClick={handleNavigate}
      onContextMenu={() => queueActions.addToQueue([track], undefined, undefined, true)}
    >
      <Avatar
        alt={track.title}
        src={thumbSrc}
        sx={{ height: 48, marginX: 1, width: 48 }}
        variant="rounded"
      >
        <IoMusicalNotes />
      </Avatar>
      <Box>
        <Typography fontFamily="Rubik, sans-serif" lineHeight={1.2} variant="body1">
          {track.title}
        </Typography>
        <Typography variant="subtitle2">
          {options?.showType ? `${track._type}\xa0 · \xa0` : ''}
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
    </Row>
  );
});

TrackRow.defaultProps = {
  options: {
    showType: false,
  },
};

export default TrackRow;
