import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Tooltip, Typography } from '@mui/joy';
import { motion, MotionValue, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { store } from 'state';

const variants = {
  artist: { borderRadius: '50%' },
  album: { borderRadius: '4px' },
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
        placement="bottom-end"
        title={
          <Typography>
            {nowPlaying.track.originalTitle || nowPlaying.track.grandparentTitle}
            &thinsp;&thinsp;—&thinsp;&thinsp;
            {nowPlaying.track.title}
          </Typography>
        }
      >
        <MotionAvatar
          animate={showArtist ? 'artist' : 'album'}
          src={showArtist ? artistThumbSrc : albumThumbSrc}
          sx={{
            boxShadow: 'var(--joy-shadow-sm)',
            height: 48,
            marginX: 1,
            width: 48,
          }}
          variants={variants}
        />
      </Tooltip>
    );
  }
);

export default NowPlayingAvatar;
