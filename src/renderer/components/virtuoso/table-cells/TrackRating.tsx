import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { Track } from 'api';
import Rating from 'components/rating/Rating';
import React from 'react';
import { HiFire } from 'react-icons/hi2';
import formatCount from 'scripts/format-count';

const popularityGradient = [
  { hex: '#fff75d', value: 1 },
  { hex: '#ffc11f', value: 4 },
  { hex: '#fe650d', value: 8 },
  { hex: '#f33c04', value: 13 },
  { hex: '#da1f05', value: 20 },
];

const TrackRating: React.FC<{ showSubtext?: 'playcount' | 'popularity'; track: Track }> = ({
  showSubtext = 'playcount',
  track,
}) => {
  return (
    <>
      <Rating id={track.id} userRating={track.userRating / 2 || 0} />
      <Show if={showSubtext === 'playcount'}>
        <Typography variant="title2">
          {track.globalViewCount
            ? formatCount(track.globalViewCount, 'play', 'unplayed')
            : formatCount(track.viewCount, 'play', 'unplayed')}
        </Typography>
      </Show>
      <Show if={showSubtext === 'popularity'}>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            height: 17.5,
            justifyContent: 'space-between',
          }}
        >
          {popularityGradient.map(({ hex, value }) => (
            <HiFire
              key={value}
              style={{
                color:
                  track.globalViewCount >= value ? hex : 'var(--mui-palette-action-hoverSelected)',
              }}
            />
          ))}
        </div>
      </Show>
    </>
  );
};

export default TrackRating;
