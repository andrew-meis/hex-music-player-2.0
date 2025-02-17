import { Memo, observer } from '@legendapp/state/react';
import { Box } from '@mui/material';
import chroma from 'chroma-js';
import ActionButton from 'components/buttons/ActionButton';
import { updateFavorite } from 'components/virtuoso/table-cells/Favorite';
import { AnimatePresence } from 'framer-motion';
import { DateTime } from 'luxon';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { LuTimer, LuTimerOff } from 'react-icons/lu';
import { PiMusicNotesPlusFill, PiWaveform } from 'react-icons/pi';
import { RiFontSize } from 'react-icons/ri';
import { TbEdit, TbLayoutGridAdd } from 'react-icons/tb';
import { persistedStore, store } from 'state';

export const DetailsActions: React.FC = observer(function DetailsActions() {
  const swatch = store.ui.nowPlaying.swatch.get();
  const color = chroma(swatch.rgb);
  const nowPlaying = store.queue.nowPlaying.get();
  const isFavorite = persistedStore.currentFavorites[nowPlaying.track.id].get();
  if (isFavorite) updateFavorite(nowPlaying.track.id, nowPlaying.track.lastViewedAt, isFavorite);

  const handleClick = () => {
    if (isFavorite) {
      persistedStore.currentFavorites[nowPlaying.track.id].delete();
      return;
    }
    persistedStore.currentFavorites[nowPlaying.track.id].set(DateTime.now().toUnixInteger());
  };

  return (
    <Box display="flex" gap={1} position="absolute" right={-8} top={-56}>
      <AnimatePresence>
        <ActionButton
          color={color}
          key="add-to-current-favorites"
          label={isFavorite ? 'Remove from Current Favorites' : 'Add to Current Favorites'}
          onClick={handleClick}
        >
          {isFavorite ? <HiHeart /> : <HiOutlineHeart />}
        </ActionButton>
        <ActionButton
          color={color}
          key="add-to-playlist"
          label="Add to Playlist"
          onClick={() => {}}
        >
          <PiMusicNotesPlusFill />
        </ActionButton>
        <ActionButton
          color={color}
          key="add-to-collection"
          label="Add to Collection"
          onClick={() => {}}
        >
          <TbLayoutGridAdd />
        </ActionButton>
        <ActionButton
          color={color}
          key="edit-metadata"
          label="Edit Track"
          onClick={() => store.ui.modals.values.track.set({ tab: '0', track: nowPlaying.track })}
        >
          <TbEdit />
        </ActionButton>
      </AnimatePresence>
    </Box>
  );
});

export const LyricsActions: React.FC = observer(function LyricsActions() {
  const swatch = store.ui.nowPlaying.swatch.get();
  const color = chroma(swatch.rgb);
  const nowPlaying = store.queue.nowPlaying.get();

  const handleFontSize = () => {
    const index = persistedStore.lyricsSize.peek();
    if (index < 6) {
      persistedStore.lyricsSize.set(index + 1);
      return;
    }
    persistedStore.lyricsSize.set(0);
  };

  return (
    <Box display="flex" gap={1} position="absolute" right={-8} top={-56}>
      <AnimatePresence>
        <ActionButton
          color={color}
          key="sync-lyrics"
          label="Toggle Synchronized Lyrics"
          onClick={() => persistedStore.syncLyrics.toggle()}
        >
          <Memo>
            {() => {
              const prefersSynced = persistedStore.syncLyrics.get();
              return prefersSynced ? <LuTimerOff /> : <LuTimer />;
            }}
          </Memo>
        </ActionButton>
        <ActionButton
          color={color}
          key="edit-font-size"
          label="Adjust Font Size"
          onClick={handleFontSize}
        >
          <RiFontSize />
        </ActionButton>
        <ActionButton
          color={color}
          key="edit-lyrics"
          label="Edit Lyrics"
          onClick={() => store.ui.modals.values.track.set({ tab: '2', track: nowPlaying.track })}
        >
          <TbEdit />
        </ActionButton>
      </AnimatePresence>
    </Box>
  );
});

export const SimilarTracksActions: React.FC = observer(function SimilarTracksActions() {
  const isActive = store.ui.nowPlaying.activeSimilarTracksTab.get();
  const swatch = store.ui.nowPlaying.swatch.get();
  const color = chroma(swatch.rgb);

  const tabs = [
    {
      key: 'related-tracks',
      icon: <FiRadio />,
      label: 'Related Tracks',
    },
    {
      key: 'sonically-similar',
      icon: <PiWaveform />,
      label: 'Sonically Similar Tracks',
    },
    {
      key: 'last.fm-similar',
      icon: <ImLastfm viewBox="0 0 17 17" />,
      label: 'last.fm Similar Tracks',
    },
    {
      key: `more-by-artist`,
      icon: <IoMdMicrophone />,
      label: 'More by Artist',
    },
  ];

  return (
    <Box display="flex" gap={1} position="absolute" right={-8} top={-56}>
      <AnimatePresence>
        {tabs.map((tab, index) => (
          <ActionButton
            color={color}
            key={tab.key}
            label={tab.label}
            sx={{
              background: isActive === index.toString() ? color.brighten().css() : color.css(),
            }}
            onClick={() => store.ui.nowPlaying.activeSimilarTracksTab.set(index.toString())}
          >
            {tab.icon}
          </ActionButton>
        ))}
      </AnimatePresence>
    </Box>
  );
});
