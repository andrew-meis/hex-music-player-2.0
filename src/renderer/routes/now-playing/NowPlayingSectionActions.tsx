import { observer } from '@legendapp/state/react';
import { Box } from '@mui/material';
import chroma from 'chroma-js';
import ActionButton from 'components/buttons/ActionButton';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { HiOutlineHeart } from 'react-icons/hi2';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { PiMusicNotesPlusFill, PiWaveform } from 'react-icons/pi';
import { RiFontSize } from 'react-icons/ri';
import { TbEdit, TbLayoutGridAdd } from 'react-icons/tb';
import { persistedStore, store } from 'state';

export const DetailsActions: React.FC = observer(function DetailsActions() {
  const swatch = store.ui.nowPlaying.swatch.get();
  const color = chroma(swatch.rgb);
  const nowPlaying = store.queue.nowPlaying.get();

  return (
    <Box display="flex" gap={1} position="absolute" right={8} top={8}>
      <AnimatePresence>
        <ActionButton
          color={color}
          key="add-to-current-favorites"
          label="Add to Current Favorites"
          onClick={() => {}}
        >
          <HiOutlineHeart />
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
          onClick={() => store.ui.modals.values.track.set(nowPlaying.track)}
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
    <Box display="flex" gap={1} position="absolute" right={8} top={8}>
      <AnimatePresence>
        <ActionButton
          color={color}
          key="edit-lyrics"
          label="Edit Lyrics"
          onClick={() => store.ui.modals.values.track.set(nowPlaying.track)}
        >
          <TbEdit />
        </ActionButton>
        <ActionButton
          color={color}
          key="edit-font-size"
          label="Adjust Font Size"
          onClick={handleFontSize}
        >
          <RiFontSize />
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
    <Box display="flex" gap={1} position="absolute" right={8} top={8}>
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
