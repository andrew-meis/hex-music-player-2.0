import { observer, Show } from '@legendapp/state/react';
import { Avatar, Box, IconButton } from '@mui/material';
import Favorite from 'components/virtuoso/table-cells/Favorite';
import TrackTitle from 'components/virtuoso/table-cells/TrackTitle';
import { AnimatePresence, motion } from 'framer-motion';
import { useImageResize } from 'hooks/useImageResize';
import React from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import { createSearchParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { store } from 'state';

const MotionBox = motion(Box);

const NowPlaying: React.FC = observer(function NowPlaying() {
  const { activeIndex, allEntries } = store.ui.navigation.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const location = useLocation();
  const navigate = useNavigate();

  const thumbSrc = useImageResize(
    new URLSearchParams({
      url: nowPlaying?.track.parentThumb || '',
      width: '100',
      height: '100',
    })
  );

  const handleButtonClick = () => {
    const previousIndex =
      allEntries
        .slice(0, activeIndex)
        .map((entry, index) => ({ entry, index }))
        .reverse()
        .find(({ entry }) => !entry.url.includes('/now-playing'))?.index ?? -1;
    if (previousIndex !== -1) {
      window.api.goToIndex(previousIndex);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        height={60}
        justifyContent="center"
        position="absolute"
        width={60}
      >
        <IconButton
          sx={{
            pointerEvents: !(
              location.pathname === '/now-playing' && location.search === '?tab=metadata'
            )
              ? 'none'
              : '',
          }}
          onClick={handleButtonClick}
        >
          <VscChevronDown />
        </IconButton>
      </Box>
      <Show
        if={!(location.pathname === '/now-playing' && location.search === '?tab=metadata')}
        wrap={AnimatePresence}
      >
        <MotionBox
          alignItems="center"
          animate={{ opacity: 1 }}
          display="flex"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          width={1}
        >
          <Link
            to={{
              pathname: '/now-playing',
              search: createSearchParams({ tab: 'metadata' }).toString(),
            }}
          >
            <Avatar
              src={thumbSrc}
              sx={{
                cursor: 'pointer',
                height: 60,
                pointerEvents: location.pathname === '/now-playing' ? 'none' : '',
                width: 60,
              }}
              variant="rounded"
            />
          </Link>
          <Box marginLeft={1} marginRight="auto">
            <TrackTitle track={nowPlaying.track} />
          </Box>
          <Favorite id={nowPlaying.track.id} lastViewedAt={nowPlaying.track.lastViewedAt} />
        </MotionBox>
      </Show>
    </>
  );
});

export default NowPlaying;
