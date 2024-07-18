import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { Playlist } from 'api';
import React from 'react';
import { Link } from 'react-router-dom';
import { createPlaylistNavigate } from 'scripts/navigate-generators';

const PlaylistTitle: React.FC<{
  showSubtext?: boolean;
  showType?: boolean;
  playlist: Playlist;
}> = ({ showSubtext = true, showType = false, playlist }) => {
  return (
    <>
      <Typography variant="title1">
        <Link
          className="link"
          to={createPlaylistNavigate(playlist)}
          onClick={(event) => event.stopPropagation()}
        >
          {playlist.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography variant="title2">
          {showType ? `${playlist._type}\xa0 · \xa0` : ''}
          {playlist.leafCount}
          &nbsp;
          {playlist.leafCount > 1 || playlist.leafCount === 0 ? 'tracks' : 'track'}
        </Typography>
      </Show>
    </>
  );
};

export default PlaylistTitle;
