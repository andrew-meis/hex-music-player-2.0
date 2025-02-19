import { Box, Grid2 as Grid, IconButton, Paper, SvgIcon, Typography } from '@mui/material';
import { MediaType } from 'api';
import { motion, useSpring, useTransform } from 'framer-motion';
import { capitalize } from 'lodash';
import { useAlbums, useArtists, useCollections, useGenres, usePlaylists, useTracks } from 'queries';
import React, { useEffect } from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { BsMusicNote, BsMusicNoteList } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { IoMdMicrophone } from 'react-icons/io';
import { LuLayoutGrid } from 'react-icons/lu';
import { MdSettings } from 'react-icons/md';
import { createSearchParams, useNavigate } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const MotionBox = motion(Box);
const MotionBoxPaper = motion(Box<typeof Paper>);

const sections = ['artists', 'albums', 'tracks', 'playlists', 'genres', 'collections'] as const;

const boxVariants = {
  default: { width: 0 },
  hover: { width: '100%' },
};

const svgs = {
  artists: <IoMdMicrophone />,
  albums: <BiSolidAlbum />,
  tracks: <BsMusicNote />,
  playlists: <BsMusicNoteList />,
  genres: <FaTags />,
  collections: <LuLayoutGrid />,
};

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

const useLibrarySection = (section: (typeof sections)[number]) => {
  const params = new URLSearchParams({ start: '0', size: '0' });
  switch (section) {
    case 'artists':
      return useArtists(params);
    case 'albums':
      return useAlbums(params);
    case 'tracks':
      return useTracks(params);
    case 'playlists':
      return usePlaylists(params);
    case 'genres':
      return useGenres(MediaType.TRACK, params);
    case 'collections':
      return useCollections(params);
    default:
      return section satisfies never;
  }
};

const LibrarySectionCard: React.FC<{
  section: (typeof sections)[number];
}> = ({ section }) => {
  const navigate = useNavigate();

  const { data } = useLibrarySection(section);

  useEffect(() => {
    store.ui.breadcrumbs.set([{ title: 'Home', to: { pathname: '/' } }]);
  }, []);

  const handleClick = () => {
    navigate({
      pathname: `/${section}`,
      search: createSearchParams({
        section: capitalize(section),
      }).toString(),
    });
  };

  return (
    <Grid size={{ lg: 2, sm: 4, xs: 6 }}>
      <MotionBoxPaper
        alignItems="center"
        borderRadius={1}
        component={Paper}
        display="flex"
        elevation={2}
        flex="1 0 0"
        height={84}
        position="relative"
        sx={{
          cursor: 'pointer',
        }}
        whileHover="hover"
        width={1}
        onClick={handleClick}
      >
        <SvgIcon sx={{ height: '44px', marginX: 2, width: '44px' }}>
          {svgs[section as (typeof sections)[number]]}
        </SvgIcon>
        <Box marginTop={0.5}>
          <Typography lineHeight="inherit" variant="h4">
            <AnimatedNumber value={data?.totalSize || 0} />
          </Typography>
          <Typography lineHeight="inherit" variant="overline">
            {section.toLocaleUpperCase()}
          </Typography>
        </Box>
        <MotionBox
          bgcolor="primary.main"
          bottom={0}
          height={4}
          position="absolute"
          variants={boxVariants}
        />
      </MotionBoxPaper>
    </Grid>
  );
};

const Library: React.FC = () => {
  const navigate = useNavigate();
  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        Library
      </Typography>
      <Grid container spacing={2}>
        {sections.map((section) => (
          <LibrarySectionCard key={section} section={section} />
        ))}
      </Grid>
      <IconButton
        sx={{ bottom: 0, position: 'absolute', right: 0 }}
        onClick={() => navigate('/settings')}
      >
        <MdSettings />
      </IconButton>
    </RouteContainer>
  );
};

export default Library;
