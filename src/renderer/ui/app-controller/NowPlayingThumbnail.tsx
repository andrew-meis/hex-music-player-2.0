import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Paper } from '@mui/material';
import React from 'react';
import { store } from 'state';

const NowPlayingThumbnail: React.FC = observer(function NowPlayingThumbnail() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const albumThumbSrc = useSelector(() => {
    return library.resizeImage(
      new URLSearchParams({ url: nowPlaying?.track.parentThumb, width: '64', height: '64' })
    );
  });

  return (
    <Avatar
      component={Paper}
      elevation={4}
      src={albumThumbSrc}
      sx={{
        cursor: 'pointer',
        flexShrink: 0,
        height: 48,
        marginLeft: 1,
        width: 48,
      }}
      variant="rounded"
      onClick={() => store.ui.overlay.toggle()}
    />
  );
});

export default NowPlayingThumbnail;
