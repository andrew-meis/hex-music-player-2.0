import { Show } from '@legendapp/state/react';
import { Box, SvgIcon, Typography } from '@mui/material';
import { Track } from 'api';
import { TrackColumnOptions } from 'components/track/columns';
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
  columnOptions?: Partial<TrackColumnOptions>;
  selectObservable: SelectObservables;
  title: string;
  tracks: Track[];
}> = ({ columnOptions, selectObservable, title, tracks }) => (
  <>
    <MotionTypography
      color="text.primary"
      paddingTop={3}
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
      columnOptions={columnOptions}
      columnVisibility={{ duration: false, index: false }}
      state={allSelectObservables[selectObservable]}
      tracks={tracks}
    />
  </>
);

const HomeTab: React.FC<{
  mostPlayedTracks: Track[];
  popularTracks: Track[];
  recentTracks: Track[];
}> = ({ mostPlayedTracks, popularTracks, recentTracks }) => {
  const slicedMostPlayedTracks = useMemo(() => mostPlayedTracks?.slice(0, 5), [mostPlayedTracks]);
  const slicedRecentTracks = useMemo(() => recentTracks?.slice(0, 5), [recentTracks]);

  return (
    <Box minHeight="var(--content-height)">
      <Box>
        <Show ifReady={slicedRecentTracks}>
          <TrackSection
            columnOptions={{ userRating: { showSubtext: 'popularity' } }}
            selectObservable={SelectObservables.ROUTE_ARTIST_RECENT_TRACKS}
            title="Recent Favorites"
            tracks={slicedRecentTracks}
          />
        </Show>
        <Show ifReady={popularTracks}>
          <TrackSection
            selectObservable={SelectObservables.ROUTE_ARTIST_POPULAR_TRACKS}
            title="Popular"
            tracks={popularTracks}
          />
        </Show>
        <Show ifReady={slicedMostPlayedTracks}>
          <TrackSection
            selectObservable={SelectObservables.ROUTE_ARTIST_MOST_PLAYED_TRACKS}
            title="Most Played"
            tracks={slicedMostPlayedTracks}
          />
        </Show>
      </Box>
    </Box>
  );
};

export default HomeTab;
