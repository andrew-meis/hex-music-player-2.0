import { Box, Grid, Sheet, SvgIcon, Typography } from '@mui/joy';
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
import isAppInit from 'app/init-app';
import { motion } from 'framer-motion';
import {
  albumsQuery,
  artistsQuery,
  collectionsQuery,
  genresQuery,
  playlistsQuery,
  tracksQuery,
} from 'queries';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { BsMusicNote, BsMusicNoteList } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { IoMdMicrophone } from 'react-icons/io';
import { LuLayoutGrid } from 'react-icons/lu';
import { createSearchParams, useLoaderData, useNavigate } from 'react-router-dom';
import { store } from 'state';

const MotionBox = motion(Box);
const MotionBoxPaper = motion(Box<typeof Sheet>);

const cardTitles = ['artists', 'albums', 'tracks', 'playlists', 'genres', 'collections'] as const;

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
  const config = store.serverConfig.get();
  const library = store.library.get();
  const artistsDataQuery = artistsQuery(config, library, { start: 0, size: 0 });
  const albumsDataQuery = albumsQuery(config, library, { start: 0, size: 0 });
  const tracksDataQuery = tracksQuery(config, library, { start: 0, size: 0 });
  const playlistsDataQuery = playlistsQuery(library, { start: 0, size: 0 });
  const genresDataQuery = genresQuery(config, library, MediaType.ALBUM, { start: 0, size: 0 });
  const collectionsDataQuery = collectionsQuery(config, library, { start: 0, size: 0 });
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
  title: string;
}> = ({ data, title }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: `/${title}`,
      search: createSearchParams({
        title,
      }).toString(),
    });
  };

  return (
    <Grid lg={2} md={4} sm={4}>
      <MotionBoxPaper
        alignItems="center"
        borderRadius={4}
        color="neutral"
        component={Sheet}
        display="flex"
        flex="1 0 0"
        height={84}
        position="relative"
        sx={{
          cursor: 'pointer',
        }}
        variant="soft"
        whileHover="hover"
        width={1}
        onClick={handleClick}
      >
        <SvgIcon sx={{ height: '46px', marginX: 2, width: '46px' }}>
          {svgs[title as (typeof cardTitles)[number]]}
        </SvgIcon>
        <Box marginTop={-0.5}>
          <Typography level="h3" lineHeight={1}>
            {data.totalSize || 0}
          </Typography>
          <Typography level="body-xs" lineHeight={1}>
            {title.toLocaleUpperCase()}
          </Typography>
        </Box>
        <MotionBox
          bgcolor="primary.500"
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
    <Box marginX={4}>
      <Typography level="h1" paddingY={2}>
        Library
      </Typography>
      <Grid container spacing={2}>
        {cardTitles.map((card) => (
          <LibrarySectionCard data={loaderData[card]} key={card} title={card} />
        ))}
      </Grid>
    </Box>
  );
};

export default Library;
