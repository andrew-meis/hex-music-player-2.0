import { Box, SvgIcon, Typography } from '@mui/material';
import { Track } from 'api';
import TrackTable from 'components/track/TrackTable';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { allSelectObservables } from 'state';
import { SelectObservables } from 'typescript';

const iconMotion = {
  hover: {
    x: [0, 4, 0],
    transition: {
      duration: 0.4,
      type: 'tween',
    },
  },
};

const MotionTypography = motion(Typography);
const MotionSvgIcon = motion(SvgIcon);

const TrackSection: React.FC<{
  selectObservable: SelectObservables;
  title: string;
  tracks: Track[];
}> = ({ selectObservable, title, tracks }) => (
  <>
    <MotionTypography
      color="text.primary"
      paddingTop={2}
      variant="h5"
      whileHover="hover"
      width="fit-content"
    >
      {title}
      <MotionSvgIcon variants={iconMotion} viewBox="0 -6 24 24">
        <BiChevronRight />
      </MotionSvgIcon>
    </MotionTypography>
    <TrackTable
      activeMenu={selectObservable}
      state={allSelectObservables[selectObservable]}
      tracks={tracks}
    />
  </>
);

const Home: React.FC<{
  mostPlayedTracks: Track[];
  popularTracks: Track[];
  recentTracks: Track[];
}> = ({ mostPlayedTracks, popularTracks, recentTracks }) => {
  const slicedMostPlayedTracks = useMemo(() => mostPlayedTracks?.slice(0, 5), [mostPlayedTracks]);
  const slicedRecentTracks = useMemo(() => recentTracks?.slice(0, 5), [recentTracks]);

  return (
    <Box>
      <TrackSection
        selectObservable={SelectObservables.ROUTE_ARTIST_RECENT_TRACKS}
        title="Recent Favorites"
        tracks={slicedRecentTracks}
      />
      <TrackSection
        selectObservable={SelectObservables.ROUTE_ARTIST_POPULAR_TRACKS}
        title="Popular"
        tracks={popularTracks}
      />
      <TrackSection
        selectObservable={SelectObservables.ROUTE_ARTIST_MOST_PLAYED_TRACKS}
        title="Most Played"
        tracks={slicedMostPlayedTracks}
      />
    </Box>
  );
};

export default Home;
