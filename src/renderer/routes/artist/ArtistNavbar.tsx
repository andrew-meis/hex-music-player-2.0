import { ObservableObject } from '@legendapp/state';
import { reactive, useObservable } from '@legendapp/state/react';
import { TabContext, TabList, TabListProps, TabPanel } from '@mui/lab';
import { Box, IconButton, SvgIcon, Tab, TabScrollButton, Typography } from '@mui/material';
import { useWindowSize } from '@react-hookz/web';
import { Album, Artist, Track } from 'api';
import { Color } from 'chroma-js';
import Scroller from 'components/scroller/Scroller';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { UseOverlayScrollbarsInstance } from 'overlayscrollbars-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { HiAdjustmentsVertical } from 'react-icons/hi2';
import { TbEdit } from 'react-icons/tb';
import { useSearchParams } from 'react-router-dom';
import { store } from 'state';

import AboutTab from './tabs/AboutTab';
import HomeTab from './tabs/HomeTab';
import ReleaseTab from './tabs/ReleaseTab';

const tabIndexes = {
  Home: 0,
  Albums: 1,
  'Singles & EPs': 2,
  'Live Albums': 3,
  Soundtracks: 4,
  Compilations: 5,
  Demos: 6,
  Remixes: 7,
  'Appears On': 8,
  About: 9,
};

const Tabs: React.FC<
  {
    tabs: string[];
    tabsWidth: number;
    viewport: HTMLDivElement;
    isScrollButtonVisible: ObservableObject<{
      left: boolean;
      right: boolean;
    }>;
  } & TabListProps
> = ({ tabs, tabsWidth, viewport, isScrollButtonVisible, onChange }) => {
  const ref = useRef(viewport);
  const { scrollXProgress } = useScroll({
    container: ref,
  });

  useMotionValueEvent(scrollXProgress, 'change', (latest) => {
    if (viewport.scrollWidth <= tabsWidth) {
      isScrollButtonVisible.set({ left: false, right: false });
      return;
    }
    if (latest === 0) {
      isScrollButtonVisible.set({ left: false, right: true });
      return;
    }
    if (latest > 0 && latest < 1) {
      isScrollButtonVisible.set({ left: true, right: true });
      return;
    }
    if (latest === 1) {
      isScrollButtonVisible.set({ left: true, right: false });
      return;
    }
  });

  useEffect(() => {
    if (viewport.scrollWidth > tabsWidth) {
      isScrollButtonVisible.set({ left: false, right: true });
    }
  }, [tabsWidth]);

  return (
    <TabList onChange={onChange}>
      {tabs.map((value) => (
        <Tab
          key={value}
          label={
            <Typography paddingTop={0.25} variant="subtitle1">
              {value}
            </Typography>
          }
          sx={{ minHeight: 48 }}
          value={tabIndexes[value].toString()}
        />
      ))}
    </TabList>
  );
};

const ReactiveTabScrollButton = reactive(TabScrollButton);

const ArtistNavbar: React.FC<{
  artist: Artist;
  color: Color;
  mostPlayedTracks: Track[];
  popularTracks: Track[];
  recentTracks: Track[];
  releases: Record<string, Album[]>;
  viewport: HTMLDivElement | undefined;
}> = ({ artist, color, mostPlayedTracks, popularTracks, recentTracks, releases, viewport }) => {
  const isScrollButtonVisible = useObservable({ left: false, right: false });
  const scrollerRef = useRef<UseOverlayScrollbarsInstance>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { width } = useWindowSize();

  useEffect(() => {
    if (store.ui.modals.open.peek()) {
      store.ui.modals.values.artist.set(artist);
    }
  }, [artist]);

  const TABS_WIDTH = Math.min(width, 1920) - 128;

  const tabs = useMemo(() => {
    return ['Home', ...Object.keys(releases), 'About'];
  }, [releases]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    searchParams.set('tabIndex', newValue);
    setSearchParams(searchParams);
  };

  return (
    <TabContext value={searchParams.get('tabIndex')!}>
      <Box
        display="flex"
        position="sticky"
        sx={(theme) => ({
          background: theme.palette.background.default,
          zIndex: 3,
        })}
        top={-1}
      >
        <ReactiveTabScrollButton
          $sx={() => ({
            backgroundImage:
              'linear-gradient(90deg, var(--mui-palette-background-default) 66%, transparent 100%)',
            color: 'text.secondary',
            height: 48,
            left: 0,
            opacity: 1,
            position: 'absolute',
            visibility: isScrollButtonVisible.left.get() ? 'auto' : 'hidden',
            width: 40,
            zIndex: 5,
          })}
          direction="left"
          orientation="horizontal"
          onClick={() => {
            if (!scrollerRef.current) return;
            const instance = scrollerRef?.current();
            if (instance) {
              instance
                .elements()
                .scrollOffsetElement.scrollBy({ left: -10000, behavior: 'smooth' });
            }
          }}
        />
        <Scroller
          options={{
            overflow: {
              x: 'scroll',
            },
            scrollbars: {
              visibility: 'hidden',
            },
          }}
          sx={{
            position: 'relative',
            width: TABS_WIDTH,
            zIndex: 2,
          }}
        >
          {({ scroller, viewport }) => {
            scrollerRef.current = scroller;
            if (!viewport) return null;
            return (
              <Tabs
                isScrollButtonVisible={isScrollButtonVisible}
                tabs={tabs}
                tabsWidth={TABS_WIDTH}
                viewport={viewport}
                onChange={handleChange}
              />
            );
          }}
        </Scroller>
        <ReactiveTabScrollButton
          $sx={() => ({
            backgroundImage:
              'linear-gradient(270deg, var(--mui-palette-background-default) 66%, transparent 100%)',
            color: 'text.secondary',
            height: 48,
            left: TABS_WIDTH - 40,
            opacity: 1,
            position: 'absolute',
            visibility: isScrollButtonVisible.right.get() ? 'auto' : 'hidden',
            width: 40,
            zIndex: 5,
          })}
          direction="right"
          orientation="horizontal"
          onClick={() => {
            if (!scrollerRef.current) return;
            const instance = scrollerRef?.current();
            if (instance) {
              instance.elements().scrollOffsetElement.scrollBy({ left: 10000, behavior: 'smooth' });
            }
          }}
        />
        <IconButton
          sx={{ marginLeft: 'auto', marginY: 'auto' }}
          onClick={() => store.ui.drawers.artist.options.open.set(true)}
        >
          <SvgIcon>
            <HiAdjustmentsVertical />
          </SvgIcon>
        </IconButton>
        <IconButton
          sx={{ marginRight: 1, marginY: 'auto' }}
          onClick={() => store.ui.modals.values.artist.set(artist)}
        >
          <SvgIcon>
            <TbEdit />
          </SvgIcon>
        </IconButton>
      </Box>
      <Box
        maxWidth={1}
        paddingX={4}
        sx={(theme) => ({
          background: theme.palette.background.default,
          position: 'relative',
          zIndex: 2,
        })}
      >
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="0">
          <HomeTab
            mostPlayedTracks={mostPlayedTracks}
            popularTracks={popularTracks}
            recentTracks={recentTracks}
          />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="1">
          <ReleaseTab releases={releases['Albums']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="2">
          <ReleaseTab releases={releases['Singles & EPs']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="3">
          <ReleaseTab releases={releases['Live Albums']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="4">
          <ReleaseTab releases={releases['Soundtracks']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="5">
          <ReleaseTab releases={releases['Compilations']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="6">
          <ReleaseTab releases={releases['Demos']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="7">
          <ReleaseTab releases={releases['Remixes']} viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="8">
          <ReleaseTab releases={releases['Appears On']} subtext="parentTitle" viewport={viewport} />
        </TabPanel>
        <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="9">
          <AboutTab artist={artist} color={color} />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default ArtistNavbar;
