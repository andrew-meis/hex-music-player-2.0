import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { Track } from 'api';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  createAlbumNavigate,
  createArtistNavigate,
  createTrackNavigate,
} from 'scripts/navigate-generators';

const TrackTitle: React.FC<{
  showAlbumTitle?: boolean;
  showSubtext?: boolean;
  showType?: boolean;
  track: Track;
}> = ({ showAlbumTitle = true, showSubtext = true, showType = false, track }) => {
  return (
    <>
      <Typography variant="title1">
        <Link
          className="link"
          to={createTrackNavigate(track)}
          onClick={(event) => event.stopPropagation()}
        >
          {track.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography variant="title2">
          {showType ? `${track._type}\xa0 · \xa0` : ''}
          <Link
            className="link"
            to={createArtistNavigate(track)}
            onClick={(event) => event.stopPropagation()}
          >
            {track.originalTitle ? track.originalTitle : track.grandparentTitle}
          </Link>
          <Show if={showAlbumTitle}>
            &nbsp; — &nbsp;
            <Link
              className="link"
              to={createAlbumNavigate(track)}
              onClick={(event) => event.stopPropagation()}
            >
              {track.parentTitle}
            </Link>
          </Show>
        </Typography>
      </Show>
    </>
  );
};

export default TrackTitle;
