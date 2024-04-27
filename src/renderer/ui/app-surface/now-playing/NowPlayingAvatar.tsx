import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion, MotionValue, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { store } from 'state';

const variants = {
  initial: (isArtist: boolean) => ({
    opacity: 0,
    borderRadius: isArtist ? '4px' : '50%',
  }),
  animate: (isArtist: boolean) => ({
    opacity: 1,
    borderRadius: isArtist ? '50%' : '4px',
  }),
  exit: (isArtist: boolean) => ({
    opacity: 0,
    borderRadius: isArtist ? '50%' : '4px',
  }),
};

const MotionAvatar = motion(Avatar);

const NowPlayingAvatar: React.FC<{ scrollYProgress: MotionValue<number> }> = observer(
  function NowPlayingAvatar({ scrollYProgress }) {
    const [showArtist, setShowArtist] = useState(true);
    const library = store.library.get();
    const nowPlaying = store.audio.nowPlaying.get();

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
      if (latest === 0) {
        setShowArtist(true);
        return;
      }
      setShowArtist(false);
    });

    const artistThumbSrc = useSelector(() => {
      return library.resizeImage({ url: nowPlaying.track.grandparentThumb, width: 64, height: 64 });
    });

    const albumThumbSrc = useSelector(() => {
      return library.resizeImage({ url: nowPlaying.track.parentThumb, width: 64, height: 64 });
    });

    return (
      <Tooltip
        arrow
        placement="left"
        title={
          !showArtist && (
            <Typography color="text.primary" padding="4px 8px" textAlign="center">
              {nowPlaying.track.originalTitle || nowPlaying.track.grandparentTitle}
              &thinsp;&thinsp;—&thinsp;&thinsp;
              {nowPlaying.track.title}
            </Typography>
          )
        }
      >
        <Box height={64} width={48}>
          <AnimatePresence initial={false} mode="popLayout">
            <MotionAvatar
              layout
              animate="animate"
              custom={showArtist}
              exit="exit"
              initial="initial"
              key={showArtist ? 'artist' : 'album'}
              src={showArtist ? artistThumbSrc : albumThumbSrc}
              sx={{
                boxShadow: 'var(--mui-shadows-2)',
                height: 48,
                position: 'relative',
                top: 8,
                width: 48,
              }}
              transition={{
                type: 'tween',
                duration: 0.5,
              }}
              variants={variants}
            />
          </AnimatePresence>
        </Box>
      </Tooltip>
    );
  }
);

export default NowPlayingAvatar;
