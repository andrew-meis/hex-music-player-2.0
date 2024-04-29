import { observer, useSelector } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import { audio } from 'audio';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { useLyrics } from 'queries';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { store } from 'state';

const getTextStyle = (playerOffset: number, startOffset: number, nextOffset: number) => {
  if (playerOffset > startOffset && playerOffset < nextOffset) {
    return 'text.primary';
  }
  if (playerOffset < startOffset) {
    return 'text.secondary';
  }
  if (playerOffset > nextOffset) {
    return 'text.disabled';
  }
  return 'text.secondary';
};

const timestampToMs = (timestamp: string) => {
  const split = timestamp.split(':') as unknown as number[];
  return split[0] * 60000 + split[1] * 1000;
};

const processSyncedLyrics = (syncedLyrics: string) => {
  const processedLyrics = syncedLyrics.split('\n').map((currentLine, index, array) => {
    const nextLine = array[index + 1];
    return {
      text: currentLine.slice(10).trim(),
      startOffset: timestampToMs(currentLine.slice(1, 9)),
      nextOffset: nextLine ? timestampToMs(nextLine.slice(1, 9)) : null,
    };
  });
  return processedLyrics;
};

const processPlainLyrics = (plainLyrics: string) => plainLyrics.split('\n');

const SyncedLine: React.FC<{
  item: { text: string; startOffset: number; nextOffset: number | null };
  changePosition: (newValue: number) => void;
  box: React.MutableRefObject<HTMLDivElement | null>;
}> = ({ item, changePosition, box }) => {
  const [line, setLine] = useState<HTMLSpanElement | null>(null);
  const { text, startOffset, nextOffset } = item;

  useEffect(() => {
    if (!box.current || !line) return;
    box.current.scrollTo({ top: line.offsetTop - 96, behavior: 'smooth' });
  }, [line]);

  const shouldSetRef = useSelector(() => {
    const currentTimeMillis = store.audio.currentTimeMillis.get();
    return (
      currentTimeMillis > startOffset &&
      currentTimeMillis < (nextOffset || store.audio.nowPlaying.track.duration.get())
    );
  });

  const color = useSelector(() => {
    const currentTimeMillis = store.audio.currentTimeMillis.get();
    return getTextStyle(
      currentTimeMillis,
      startOffset,
      nextOffset || store.audio.nowPlaying.track.duration.get()
    );
  });

  return (
    <Typography
      ref={shouldSetRef ? setLine : null}
      sx={{
        color,
        cursor: 'pointer',
        '&:hover': {
          color: 'text.primary',
        },
      }}
      variant="h5"
      onClick={() => changePosition(startOffset)}
    >
      {text || ''}
      &nbsp;
    </Typography>
  );
};

const SyncedLyrics: React.FC<{
  syncedLyrics: ReturnType<typeof processSyncedLyrics>;
}> = ({ syncedLyrics }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [syncedLyrics]);

  const [initialize] = useOverlayScrollbars({
    options: {
      update: {
        debounce: null,
      },
      scrollbars: {
        visibility: 'hidden',
      },
    },
  });

  useEffect(() => {
    if (!ref.current) return;
    initialize({
      target: ref.current,
      elements: {
        viewport: ref.current,
      },
    });
  }, [initialize, ref]);

  const changePosition = (newValue: number) => {
    audio.currentTime = (newValue as number) / 1000;
  };

  return (
    <Box
      height="-webkit-fill-available"
      margin={2}
      overflow="auto"
      ref={ref}
      width="calc(100% - 80px)"
    >
      <Box color="text.primary" height="fit-content">
        {syncedLyrics.map((value, index) => (
          <SyncedLine box={ref} changePosition={changePosition} item={value} key={index} />
        ))}
      </Box>
    </Box>
  );
};

const PlainLyrics: React.FC<{
  plainLyrics: ReturnType<typeof processPlainLyrics>;
}> = ({ plainLyrics }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [plainLyrics]);

  const [initialize] = useOverlayScrollbars({
    options: {
      update: {
        debounce: null,
      },
      scrollbars: {
        visibility: 'hidden',
      },
    },
  });

  useEffect(() => {
    if (!ref.current) return;
    initialize({
      target: ref.current,
      elements: {
        viewport: ref.current,
      },
    });
  }, [initialize, ref]);

  return (
    <Box
      height="-webkit-fill-available"
      margin={2}
      overflow="auto"
      ref={ref}
      width="calc(100% - 80px)"
    >
      <Box color="text.primary" height="fit-content">
        {plainLyrics.map((value, index) => (
          <Typography
            key={index}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
            }}
            variant="h5"
          >
            {value || ''}
            &nbsp;
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const NowPlayingLyrics: React.FC = observer(function NowPlayingLyrics() {
  const nowPlaying = store.audio.nowPlaying.get();

  const { data: lyrics } = useLyrics(nowPlaying.track);

  const syncedLyrics = useMemo(() => {
    if (!lyrics || !lyrics.syncedLyrics) return undefined;
    return processSyncedLyrics(lyrics.syncedLyrics);
  }, [lyrics]);

  const plainLyrics = useMemo(() => {
    if (!lyrics || !lyrics.plainLyrics) return undefined;
    return processPlainLyrics(lyrics.plainLyrics);
  }, [lyrics]);

  if (syncedLyrics) {
    return <SyncedLyrics syncedLyrics={syncedLyrics} />;
  }

  if (!syncedLyrics && plainLyrics) {
    return <PlainLyrics plainLyrics={plainLyrics} />;
  }

  if (lyrics?.instrumental) {
    return (
      <Box
        alignItems="center"
        display="flex"
        height="-webkit-fill-available"
        justifyContent="center"
        margin={2}
        overflow="auto"
        width="calc(100% - 80px)"
      >
        <Box color="text.primary" height="fit-content">
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
            }}
            variant="h5"
          >
            ...track is instrumental...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!syncedLyrics && !plainLyrics && !lyrics?.instrumental) {
    return (
      <Box
        alignItems="center"
        display="flex"
        height="-webkit-fill-available"
        justifyContent="center"
        margin={2}
        overflow="auto"
        width="calc(100% - 80px)"
      >
        <Box color="text.primary" height="fit-content">
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              textAlign: 'center',
            }}
            variant="h5"
          >
            ...no lyrics found...
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
});

export default NowPlayingLyrics;
