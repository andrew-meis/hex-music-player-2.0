import { useSelector } from '@legendapp/state/react';
import { Avatar, Box, Chip, SvgIcon, Typography } from '@mui/material';
import PlayFab from 'components/buttons/PlayFab';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { playbackActions } from 'features/playback';
import { groupBy, sumBy } from 'lodash';
import { Duration } from 'luxon';
import { useAlbum, useAlbumTracks } from 'queries';
import React, { useEffect, useMemo } from 'react';
import { BiAlbum } from 'react-icons/bi';
import { createSearchParams, NavLink, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import formatCount from 'scripts/format-count';
import { createArtistNavigate } from 'scripts/navigate-generators';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

import { albumLoader } from './loader';

const Album: React.FC = () => {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof albumLoader>>;
  const { guid, id, parentGuid, parentId, parentTitle, title } = loaderData;

  const selectObservable = allSelectObservables[SelectObservables.ROUTE_ALBUM];

  const { data: album } = useAlbum(id);
  const { data: tracks } = useAlbumTracks(id);

  const thumbSrc = useSelector(() => {
    if (!album) return undefined;
    const library = store.library.get();
    return library.server.getAuthenticatedUrl(album.thumb);
  });

  const artistThumbSrc = useSelector(() => {
    if (!album) return undefined;
    const library = store.library.get();
    return library.resizeImage(
      new URLSearchParams({
        url: album.parentThumb,
        width: '64',
        height: '64',
      })
    );
  });

  const multipleDiscs = useMemo(() => {
    if (tracks) {
      return Object.keys(groupBy(tracks, 'parentIndex')).length > 1;
    }
    return false;
  }, [tracks]);

  const totalDuration = useMemo(() => {
    if (tracks) {
      return sumBy(tracks, 'duration');
    }
    return 0;
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
        <Box display="flex" flexDirection="column" width={1}>
          <Box display="flex" height="min(100vh - 266px, 256px)" width={1}>
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
                marginRight: 2,
                height: 'auto',
                width: 'auto',
              }}
            >
              <SvgIcon sx={{ height: 1, width: 1 }}>
                <BiAlbum />
              </SvgIcon>
            </Avatar>
            <Box display="flex" flexDirection="column" width={1}>
              <Typography color="text.secondary" marginTop="auto" variant="subtitle2">
                {[...album.format, ...album.subformat].map((item, index, { length }) => {
                  if (length - 1 === index) {
                    return <span key={index}>{item.tag.toLowerCase()}</span>;
                  }
                  return (
                    <span key={index}>
                      {item.tag.toLowerCase()}
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                    </span>
                  );
                })}
              </Typography>
              <Typography
                display="-webkit-box"
                marginBottom={2}
                marginTop={1}
                overflow="hidden"
                sx={{
                  wordBreak: 'break-word',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
                variant="h1"
              >
                {title}
              </Typography>
              <Box alignItems="center" display="flex" width={1}>
                <Avatar src={artistThumbSrc} sx={{ height: 32, marginRight: 1, width: 32 }} />
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
                  <Box color="text.primary" display="inline-flex">
                    <NavLink
                      className="link"
                      style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
                      to={createArtistNavigate(album)}
                    >
                      {album.parentTitle}
                    </NavLink>
                  </Box>
                  &nbsp;&nbsp;·&nbsp;&nbsp;
                  {album.year}
                  &nbsp;&nbsp;·&nbsp;&nbsp;
                  {formatCount(album.leafCount, 'song', 'no songs')}
                  &nbsp;&nbsp;·&nbsp;&nbsp;
                  {Duration.fromMillis(totalDuration).toFormat(
                    totalDuration >= 3600000 ? `h' hr' m' min'` : `m' min'`
                  )}
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={0.5} paddingTop={2}>
                {album.genre.map((genre) => (
                  <Chip key={genre.id} label={genre.tag} size="small" />
                ))}
              </Box>
            </Box>
          </Box>
          <Box marginTop={2}>
            <PlayFab onClick={() => playbackActions.playLibraryItems([album], false)} />
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
      )}
    </RouteContainer>
  );
};

export default Album;
