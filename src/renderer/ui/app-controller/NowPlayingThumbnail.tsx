import { observer, reactive, Show, useSelector } from '@legendapp/state/react';
import { Avatar } from '@mui/material';
import React from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { store } from 'state';

const ReactiveAvatar = reactive(Avatar);

const NowPlayingThumbnail: React.FC = observer(function NowPlayingThumbnail() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const albumThumbSrc = useSelector(() => {
    return library.resizeImage(
      new URLSearchParams({ url: nowPlaying?.track.parentThumb, width: '64', height: '64' })
    );
  });

  return (
    <>
      <ReactiveAvatar
        $sx={() => ({
          boxShadow: 'var(--mui-shadows-2)',
          cursor: 'pointer',
          flexShrink: 0,
          height: 48,
          marginLeft: 1,
          opacity: store.ui.overlay.get() ? 0 : 1,
          width: 48,
        })}
        src={albumThumbSrc}
        variant="rounded"
        onClick={() => store.ui.overlay.toggle()}
      />
      <Show if={store.ui.overlay}>
        <Avatar
          sx={(theme) => ({
            background: 'transparent',
            color: theme.palette.text.secondary,
            position: 'absolute',
            pointerEvents: 'none',
            right: 8,
            height: 48,
            width: 48,
          })}
          variant="rounded"
        >
          <IoChevronDown />
        </Avatar>
      </Show>
    </>
  );
});

export default NowPlayingThumbnail;
