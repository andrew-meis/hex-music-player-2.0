import { Show } from '@legendapp/state/react';
import { Box, SvgIcon, Tooltip, Typography } from '@mui/material';
import { Artist, Track } from 'api';
import TrackTable from 'components/track/TrackTable';
import { flag } from 'country-emoji';
import { motion } from 'framer-motion';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import emoji from 'react-easy-emoji';
import { BiChevronRight } from 'react-icons/bi';
import { allSelectObservables } from 'state';
import { SelectObservables } from 'typescript';

const countryMap = (country: string) => {
  switch (country) {
    case 'Republic of Korea':
      return 'South Korea';
    default:
      return country;
  }
};

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

const HomeTab: React.FC<{
  artist: Artist;
  mostPlayedTracks: Track[];
  popularTracks: Track[];
  recentTracks: Track[];
}> = ({ artist, mostPlayedTracks, popularTracks, recentTracks }) => {
  const slicedMostPlayedTracks = useMemo(() => mostPlayedTracks?.slice(0, 5), [mostPlayedTracks]);
  const slicedRecentTracks = useMemo(() => recentTracks?.slice(0, 5), [recentTracks]);

  return (
    <Box>
      <Box
        alignItems="center"
        display="flex"
        height={32}
        justifyContent="flex-start"
        maxWidth={180}
        minWidth={180}
        paddingTop={3}
      >
        {!isEmpty(artist.country) && (
          <>
            {artist.country.map((country) => (
              <Tooltip
                arrow
                key={country.id}
                placement="right"
                title={
                  <Typography color="text.primary" variant="subtitle2">
                    {country.tag}
                  </Typography>
                }
              >
                <Box display="flex" fontSize="2.5rem" width="min-content">
                  {emoji(flag(countryMap(country.tag)))}
                </Box>
              </Tooltip>
            ))}
            <Typography flexShrink={0} mx="8px">
              ┊
            </Typography>
          </>
        )}
        {artist.viewCount > 0 && (
          <Typography textAlign="right">
            {artist.viewCount} {artist.viewCount === 1 ? 'play' : 'plays'}
          </Typography>
        )}
        {!artist.viewCount && <Typography textAlign="right">unplayed</Typography>}
      </Box>
      <Box>
        <Show ifReady={slicedRecentTracks}>
          <TrackSection
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
