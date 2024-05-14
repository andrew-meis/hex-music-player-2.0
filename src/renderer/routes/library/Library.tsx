import { Box, Grid, Paper, SvgIcon, Typography } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import {
  AlbumContainer,
  ArtistContainer,
  CollectionContainer,
  GenreContainer,
  MediaType,
  PlaylistContainer,
  TrackContainer,
} from 'api';
import { motion } from 'framer-motion';
import { capitalize } from 'lodash';
import {
  albumsQuery,
  artistsQuery,
  collectionsQuery,
  genresQuery,
  playlistsQuery,
  tracksQuery,
} from 'queries';
import React, { useEffect } from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { BsMusicNote, BsMusicNoteList } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { IoMdMicrophone } from 'react-icons/io';
import { LuLayoutGrid } from 'react-icons/lu';
import { createSearchParams, useLoaderData, useNavigate } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import isAppInit from 'scripts/init-app';
import { store } from 'state';

const MotionBox = motion(Box);
const MotionBoxPaper = motion(Box<typeof Paper>);

const sections = ['artists', 'albums', 'tracks', 'playlists', 'genres', 'collections'] as const;

interface loaderReturn {
  artists: ArtistContainer;
  albums: AlbumContainer;
  tracks: TrackContainer;
  playlists: PlaylistContainer;
  genres: GenreContainer;
  collections: CollectionContainer;
}

export const libraryLoader = (queryClient: QueryClient) => async (): Promise<loaderReturn> => {
  await isAppInit();
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  const artistsDataQuery = artistsQuery(
    sectionId,
    library,
    new URLSearchParams({ start: '0', size: '0' })
  );
  const albumsDataQuery = albumsQuery(
    sectionId,
    library,
    new URLSearchParams({ start: '0', size: '0' })
  );
  const tracksDataQuery = tracksQuery(
    sectionId,
    library,
    true,
    new URLSearchParams({ start: '0', size: '0' })
  );
  const playlistsDataQuery = playlistsQuery(
    library,
    new URLSearchParams({ start: '0', size: '0' })
  );
  const genresDataQuery = genresQuery(
    sectionId,
    library,
    MediaType.ALBUM,
    new URLSearchParams({ start: '0', size: '0' })
  );
  const collectionsDataQuery = collectionsQuery(
    sectionId,
    library,
    new URLSearchParams({ start: '0', size: '0' })
  );
  return {
    artists:
      queryClient.getQueryData(artistsDataQuery.queryKey) ??
      (await queryClient.fetchQuery(artistsDataQuery)),
    albums:
      queryClient.getQueryData(albumsDataQuery.queryKey) ??
      (await queryClient.fetchQuery(albumsDataQuery)),
    tracks:
      queryClient.getQueryData(tracksDataQuery.queryKey) ??
      (await queryClient.fetchQuery(tracksDataQuery)),
    playlists:
      queryClient.getQueryData(playlistsDataQuery.queryKey) ??
      (await queryClient.fetchQuery(playlistsDataQuery)),
    genres:
      queryClient.getQueryData(genresDataQuery.queryKey) ??
      (await queryClient.fetchQuery(genresDataQuery)),
    collections:
      queryClient.getQueryData(collectionsDataQuery.queryKey) ??
      (await queryClient.fetchQuery(collectionsDataQuery)),
  };
};

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

const LibrarySectionCard: React.FC<{
  data: Record<string, any>;
  section: string;
}> = ({ data, section }) => {
  const navigate = useNavigate();

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
    <Grid item lg={2} md={4} sm={4}>
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
          <Typography lineHeight="inherit" variant="h3">
            {data.totalSize || 0}
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
  const loaderData = useLoaderData() as Awaited<loaderReturn>;

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        Library
      </Typography>
      <Grid container spacing={2}>
        {sections.map((section) => (
          <LibrarySectionCard data={loaderData[section]} key={section} section={section} />
        ))}
      </Grid>
    </RouteContainer>
  );
};

export default Library;
