import { observer } from '@legendapp/state/react';
import { IconButton, SvgIcon } from '@mui/material';
import { audio } from 'audio';
import React from 'react';
import { IoPlaySkipForward } from 'react-icons/io5';
import { persistedStore, store } from 'state';

const Next: React.FC = observer(function Next() {
  const next = store.queue.next.get();

  const handleNext = async () => {
    audio.skip();
    if (!store.audio.isPlaying.peek()) {
      store.audio.isPlaying.set(true);
      store.audio.autoplay.set(true);
    }
  };

  return (
    <IconButton
      disabled={persistedStore.queueId.get() === 0 || !next}
      sx={{
        cursor: 'default',
        marginLeft: 0.5,
        padding: 1,
      }}
      onClick={handleNext}
    >
      <SvgIcon sx={{ width: 20, height: 20 }}>
        <IoPlaySkipForward />
      </SvgIcon>
    </IconButton>
  );
});

export default Next;
