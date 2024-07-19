import { observer } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import Textfit from '@namhong2001/react-textfit';
import { useIntersectionObserver, useWindowSize } from '@react-hookz/web';
import { useQuery } from '@tanstack/react-query';
import { Album, Artist as ArtistType, SORT_TRACKS_BY_PLAYS } from 'api';
import { Color } from 'chroma-js';
import Palette from 'components/palette/Palette';
import Scroller from 'components/scroller/Scroller';
import { motion } from 'framer-motion';
import { isEmpty } from 'lodash';
import { useAlbumsArtistAppearsOn, useArtist, useRecentTracks, useTracksByArtist } from 'queries';
import React, { useEffect, useMemo, useRef } from 'react';
import { createSearchParams, useLoaderData, useLocation } from 'react-router-dom';
import { store } from 'state';

import ArtistTabs from './ArtistTabs';
import { artistLoader } from './loader';

const getMeta = (url: string) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });

const scale = (inputY: number, yRange: number[], xRange: number[]) => {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const percent = (inputY - yMin) / (yMax - yMin);
  return percent * (xMax - xMin) + xMin;
};

const thresholds = Array.from(Array(101).keys()).map((n) => n / 100);

const Banner: React.FC<{ artist: ArtistType; color: Color; viewport: HTMLDivElement | undefined }> =
  observer(function Banner({ artist, color, viewport }) {
    const elementRef = useRef<HTMLDivElement>(null);
    const intersection = useIntersectionObserver(elementRef, {
      root: viewport,
      threshold: thresholds,
    });
    const library = store.library.get();
    const { height, width } = useWindowSize();

    const bannerSrc = artist.art ? library.server.getAuthenticatedUrl(artist.art) : undefined;
    const thumbSrc = artist.thumb ? library.server.getAuthenticatedUrl(artist.thumb) : undefined;

    const { data: bannerDimensions } = useQuery({
      queryKey: ['banner-dimensions', artist.id],
      queryFn: async () => {
        const img = (await getMeta(bannerSrc!)) as HTMLImageElement;
        return { height: img.height, width: img.width };
      },
      enabled: !!artist.art,
    });

    const bannerGrowthAdjustment = scale(intersection?.intersectionRatio || 1, [0, 1], [0, 48]);

    const bannerWidthAdjustment = useMemo(() => {
      if (!bannerDimensions || !width) return undefined;
      const renderedImageRatio = bannerDimensions.width / (width + 48);
      const renderedImageHeight = bannerDimensions.height / renderedImageRatio;
      const adjustmentRatio = Math.max(height * 0.5, 280) / renderedImageHeight;
      const desiredImageWidth = (width + 48) * adjustmentRatio;
      return Math.max(desiredImageWidth - (width + 48), 0);
    }, [bannerDimensions, height, width]);

    const colorAlpha = intersection?.intersectionRatio
      ? 1 - (intersection ? intersection.intersectionRatio : 1)
      : 1;

    const thumbPositionAdjustment = useMemo(() => {
      return width >= 1936 ? (width - 1936) / 2 : 0;
    }, [width]);

    const thumbGrowthAdjustment = scale(intersection?.intersectionRatio || 1, [0, 1], [0, 12]);

    return (
      <>
        <div
          style={{
            position: 'fixed',
            width: 'calc(100% - 16px)',
            maxWidth: 1920,
            height: 'var(--content-height)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <div
            className="corner"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          <div
            className="corner"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: 'rotate(90deg)',
            }}
          />
          {!artist.art && (
            <div
              style={{
                background: 'var(--mui-palette-background-default)',
                height: (Math.max(height / 2, 280) - 216) / 2,
                left: 12,
                position: 'absolute',
                top: 0,
                width: 384,
              }}
            >
              <div
                className="corner"
                style={{
                  position: 'absolute',
                  bottom: -18,
                  left: 0,
                }}
              />
              <div
                className="corner"
                style={{
                  position: 'absolute',
                  bottom: -18,
                  right: 0,
                  transform: 'rotate(90deg)',
                }}
              />
            </div>
          )}
        </div>
        <Box height="50vh" minHeight={280} ref={elementRef} sx={{ containerType: 'inline-size' }}>
          {artist.art && bannerWidthAdjustment !== undefined && (
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              ref={elementRef}
              style={{
                backgroundAttachment: 'fixed',
                backgroundImage: `url(${bannerSrc})`,
                backgroundPositionX: '50%',
                backgroundPositionY: 76,
                backgroundRepeat: 'no-repeat',
                backgroundSize:
                  Math.min(width, 1920) + bannerWidthAdjustment + bannerGrowthAdjustment,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                boxShadow: `inset 0 0 0 50vw rgba(${color.rgb()}, ${colorAlpha})`,
                height: '100%',
                width: '100%',
              }}
            />
          )}
          {!artist.art && !!artist.thumb && (
            <>
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                style={{
                  backgroundAttachment: 'fixed',
                  backgroundImage: `url(${thumbSrc})`,
                  backgroundPositionX: 20 + thumbPositionAdjustment,
                  backgroundPositionY: 'calc(calc(calc(max(50vh, 280px) - 216px) / 2) + 76px)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 384 + thumbGrowthAdjustment,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  boxShadow: `inset 0 0 0 50vw rgba(${color.rgb()}, ${colorAlpha})`,
                  marginLeft: 12,
                  height: 216,
                  width: 384,
                  position: 'fixed',
                  top: 'calc(calc(max(50vh, 280px) - 216px) / 2)',
                }}
              />
            </>
          )}
        </Box>
        <Typography
          component="div"
          fontFamily="TT Commons, sans-serif"
          fontWeight={700}
          left={24}
          position="absolute"
          sx={(theme) => ({
            color: theme.palette.common.white,
            textShadow: '2px 4px 8px rgb(40 40 48 / 60%)',
            zIndex: 10,
          })}
          top="calc(max(50vh, 280px) - 108px)"
          width={0.8}
        >
          <Textfit max={72} min={24} mode="single">
            {artist.title}
          </Textfit>
        </Typography>
      </>
    );
  });

const Artist: React.FC = () => {
  const location = useLocation();
  const { guid, id, title } = useLoaderData() as Awaited<ReturnType<typeof artistLoader>>;

  const { data: artistData } = useArtist(id);
  const { data: appearances } = useAlbumsArtistAppearsOn(id, guid, title);

  const recentTrackQueryIDs = useMemo(() => {
    if (!appearances) return [];
    return [id, ...appearances.map((album) => album.id)];
  }, [appearances]);

  const { data: recentTracks } = useRecentTracks(
    recentTrackQueryIDs,
    90,
    title,
    recentTrackQueryIDs.length > 0
  );

  const { data: mostPlayedTracks } = useTracksByArtist(
    guid,
    id,
    SORT_TRACKS_BY_PLAYS.desc,
    title,
    true,
    true
  );

  const releases = useMemo(() => {
    if (!artistData || !appearances) return {};
    const releaseIDs: number[] = [];
    let returnData = {} as Record<string, Album[]>;
    artistData.artists[0].hubs.forEach((hub) => {
      if (hub.type === 'album' && hub.size > 0) {
        releaseIDs.push(...hub.items.map((item) => item.id));
        returnData[hub.title] = hub.items as Album[];
      }
    });
    const filteredAlbums = artistData.artists[0].albums.filter(
      (album) => !releaseIDs.includes(album.id)
    );
    if (filteredAlbums.length > 0) {
      returnData = Object.assign({ Albums: filteredAlbums }, returnData);
    }
    if (appearances.length > 0) {
      returnData['Appears On'] = appearances.map((album) => ({
        ...album,
        subformat: [...album.subformat, { id: 0, filter: 'appearance', tag: 'appearance' }],
      }));
    }
    return returnData;
  }, [artistData, appearances]);

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
      },
      {
        title,
        to: {
          pathname: `/artists/${id}`,
          search: createSearchParams({ guid, title, tabIndex: '0' }).toString(),
        },
      },
    ]);
  }, [id]);

  if (isEmpty(releases) || !recentTracks || !mostPlayedTracks) return null;

  return (
    <Scroller sx={{ height: '100%' }}>
      {({ viewport }) => {
        const [artist] = artistData!.artists;
        return (
          <Palette src={artist.art || artist.thumb}>
            {({ isReady, color }) =>
              isReady && (
                <motion.div
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key={location.pathname}
                  style={{ height: '100%' }}
                >
                  <Banner artist={artist} color={color} viewport={viewport} />
                  <ArtistTabs
                    artist={artist}
                    color={color}
                    mostPlayedTracks={mostPlayedTracks || []}
                    popularTracks={artist.popularTracks}
                    recentTracks={recentTracks}
                    releases={releases}
                    viewport={viewport}
                  />
                </motion.div>
              )
            }
          </Palette>
        );
      }}
    </Scroller>
  );
};

export default Artist;
