import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { Track } from 'api';
import Rating from 'components/rating/Rating';
import React from 'react';

const formatPlaycount = (x: number) => {
  switch (true) {
    case x === 1:
      return `${x} play`;
    case x > 1:
      return `${x} plays`;
    default:
      return 'unplayed';
  }
};

const TrackRating: React.FC<{ showSubtext?: boolean; track: Track }> = ({
  showSubtext = true,
  track,
}) => {
  return (
    <>
      <Rating id={track.id} userRating={track.userRating / 2 || 0} />
      <Show if={showSubtext}>
        <Typography variant="title2">
          {track.globalViewCount
            ? formatPlaycount(track.globalViewCount)
            : formatPlaycount(track.viewCount)}
        </Typography>
      </Show>
    </>
  );
};

export default TrackRating;
