import { ObservablePrimitiveBaseFns } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { Button, SvgIcon } from '@mui/material';
import chroma from 'chroma-js';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { BiMessageSquareEdit } from 'react-icons/bi';
import { TbMoodPlus, TbTags } from 'react-icons/tb';
import { store } from 'state';

const MotionButton = motion(Button);

const LyricsActions: React.FC<{
  activeSection: ObservablePrimitiveBaseFns<number | undefined>;
}> = observer(function LyricsActions({ activeSection }) {
  const color = store.ui.nowPlaying.color.get();
  const isActive = activeSection.get() === 2;
  const nowPlaying = store.queue.nowPlaying.get();
  return (
    <AnimatePresence>
      {isActive && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.5 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 48,
            top: 16,
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
    </AnimatePresence>
  );
});

const MetadataActions: React.FC<{
  activeSection: ObservablePrimitiveBaseFns<number | undefined>;
}> = observer(function MetadataActions({ activeSection }) {
  const color = store.ui.nowPlaying.color.get();
  const isActive = activeSection.get() === 4;

  return (
    <AnimatePresence>
      {isActive && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.5 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          key="moods"
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 48,
            top: 16,
            '&:hover': {
              background: color.brighten().css(),
            },
          }}
          variant="contained"
          onClick={() => {}}
        >
          <SvgIcon>
            <TbMoodPlus />
          </SvgIcon>
        </MotionButton>
      )}
      {isActive && (
        <MotionButton
          animate={{ scale: [0, 1.25, 1], transition: { delay: 0.5 } }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          key="genres"
          sx={{
            background: color.css(),
            color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
            minWidth: 0,
            padding: 0.5,
            position: 'absolute',
            right: 88,
            top: 16,
            '&:hover': {
              background: color.brighten().css(),
            },
          }}
          variant="contained"
          onClick={() => {}}
        >
          <SvgIcon>
            <TbTags />
          </SvgIcon>
        </MotionButton>
      )}
    </AnimatePresence>
  );
});

const NowPlayingSectionActions: React.FC<{
  activeSection: ObservablePrimitiveBaseFns<number | undefined>;
}> = ({ activeSection }) => (
  <>
    <LyricsActions activeSection={activeSection} />
    <MetadataActions activeSection={activeSection} />
  </>
);

export default NowPlayingSectionActions;
