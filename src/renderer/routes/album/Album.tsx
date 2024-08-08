import { Avatar, Box, Chip, Typography } from '@mui/material';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { groupBy, sumBy } from 'lodash';
import { Duration } from 'luxon';
import { useAlbum, useAlbumTracks } from 'queries';
import React, { useEffect, useMemo } from 'react';
import { createSearchParams, NavLink, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { createArtistNavigate } from 'scripts/navigate-generators';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

import { albumLoader } from './loader';

const Album: React.FC = () => {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof albumLoader>>;
  const { guid, id, parentGuid, parentId, parentTitle, title } = loaderData;

  const library = store.library.get();
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_ALBUM];

  const { data: album } = useAlbum(id);
  const { data: tracks } = useAlbumTracks(id);

  const thumbSrc = useMemo(() => {
    if (album) {
      return library.server.getAuthenticatedUrl(album.thumb);
    }
    return undefined;
  }, [album]);

  const multipleDiscs = useMemo(() => {
    if (tracks) {
      return Object.keys(groupBy(tracks, 'parentIndex')).length > 1;
    }
    return false;
  }, [tracks]);

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
      },
      {
        title: parentTitle,
        to: {
          pathname: `/artists/${parentId}`,
          search: createSearchParams({
            guid: parentGuid,
            title: parentTitle,
            tabIndex: '0',
          }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/albums/${id}`,
          search: createSearchParams({ guid, parentGuid, parentId, parentTitle, title }).toString(),
        },
      },
    ]);
  }, [id]);

  if (!album || !tracks) return null;

  return (
    <RouteContainer style={{ display: 'flex' }}>
      {({ viewport }) => (
        <>
          <Box flexBasis="66%" flexGrow={1}>
            <Typography paddingBottom={2} variant="h1">
              {title}
            </Typography>
            <Box alignItems="center" display="flex" flexDirection="column" width={1}>
              <Typography
                color="text.secondary"
                display="-webkit-box"
                flexShrink={0}
                overflow="hidden"
                sx={{
                  wordBreak: 'break-word',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
                variant="subtitle1"
                width={1}
              >
                <NavLink
                  className="link"
                  style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
                  to={createArtistNavigate(album)}
                >
                  {album.parentTitle}
                </NavLink>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                {album.year}
                &nbsp;&nbsp;·&nbsp;&nbsp;
                {`${album.leafCount} songs`}
                &nbsp;&nbsp;·&nbsp;&nbsp;
                {Duration.fromMillis(sumBy(tracks, 'duration')).toFormat(`h' hr' m' min'`)}
              </Typography>
            </Box>
            <VirtualTrackTable
              activeMenu={SelectObservables.ROUTE_ALBUM}
              columnGrouping={multipleDiscs ? ['parentIndex'] : []}
              columnOptions={{ title: { showAlbumTitle: false } }}
              columnVisibility={{ thumb: false }}
              state={selectObservable}
              tracks={tracks || []}
              useWindowScroll={true}
              viewport={viewport}
            />
          </Box>
          <Box
            flexBasis="33%"
            flexDirection="column"
            height="fit-content"
            maxWidth={400}
            position="sticky"
            top={0}
          >
            <Avatar
              slotProps={{
                img: {
                  sx: {
                    aspectRatio: '1 / 1',
                    objectFit: 'fill',
                  },
                },
              }}
              src={thumbSrc}
              sx={{
                borderRadius: 2,
                boxShadow: 'var(--mui-shadows-2)',
                margin: 2,
                height: 'auto',
                width: 'calc(100% - 16px)',
              }}
            />
            <Box display="flex" gap={1} marginX={2}>
              {album.genre.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.tag}
                  sx={{ borderWidth: 2, color: 'text.secondary' }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </>
      )}
    </RouteContainer>
  );
};

export default Album;
