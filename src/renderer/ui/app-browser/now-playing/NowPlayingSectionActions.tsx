import { ObservablePrimitiveBaseFns } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { Button, SvgIcon } from '@mui/material';
import chroma from 'chroma-js';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { BiMessageSquareEdit } from 'react-icons/bi';
import { PiMusicNotesPlusFill } from 'react-icons/pi';
import { RiFileEditLine, RiFontSize } from 'react-icons/ri';
import { TbLayoutGridAdd } from 'react-icons/tb';
import { persistedStore, store } from 'state';

const MotionButton = motion(Button);

export const HeaderActions: React.FC<{
  activeSection: ObservablePrimitiveBaseFns<number>;
}> = observer(function HeaderActions({ activeSection }) {
  const color = store.ui.nowPlaying.color.get();
  const isActive = activeSection.get() === 1;
  const isHovered = store.ui.nowPlaying.artHovered.get();
  const nowPlaying = store.queue.nowPlaying.get();

  return (
    <AnimatePresence>
      {isActive && isHovered && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.3 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          key="edit-metadata"
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 16,
            bottom: 16,
            zIndex: 100,
            '&:hover': {
              background: color.brighten().css(),
            },
          }}
          variant="contained"
          onClick={() => store.ui.modals.editMetadataTrack.set(nowPlaying.track)}
        >
          <SvgIcon>
            <RiFileEditLine />
          </SvgIcon>
        </MotionButton>
      )}
      {isActive && isHovered && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.3 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          key="add-to-playlist"
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 56,
            bottom: 16,
            zIndex: 100,
            '&:hover': {
              background: color.brighten().css(),
            },
          }}
          variant="contained"
          onClick={() => {}}
        >
          <SvgIcon>
            <PiMusicNotesPlusFill />
          </SvgIcon>
        </MotionButton>
      )}
      {isActive && isHovered && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.3 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          key="add-to-collection"
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 96,
            bottom: 16,
            zIndex: 100,
            '&:hover': {
              background: color.brighten().css(),
            },
          }}
          variant="contained"
          onClick={() => {}}
        >
          <SvgIcon>
            <TbLayoutGridAdd />
          </SvgIcon>
        </MotionButton>
      )}
    </AnimatePresence>
  );
});

export const LyricsActions: React.FC<{
  activeSection: ObservablePrimitiveBaseFns<number>;
}> = observer(function LyricsActions({ activeSection }) {
  const color = store.ui.nowPlaying.color.get();
  const isActive = activeSection.get() === 2;
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
    <AnimatePresence>
      {isActive && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.3 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          key="edit-lyrics"
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 32,
            bottom: 32,
            '&:hover': {
              background: color.brighten().css(),
            },
          }}
          variant="contained"
          onClick={() => store.ui.modals.editLyricsTrack.set(nowPlaying.track)}
        >
          <SvgIcon>
            <BiMessageSquareEdit />
          </SvgIcon>
        </MotionButton>
      )}
      {isActive && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.3 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          key="edit-font-size"
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 72,
            bottom: 32,
            '&:hover': {
              background: color.brighten().css(),
            },
          }}
          variant="contained"
          onClick={handleFontSize}
        >
          <SvgIcon>
            <RiFontSize />
          </SvgIcon>
        </MotionButton>
      )}
    </AnimatePresence>
  );
});
