import { reactive, Show, useSelector } from '@legendapp/state/react';
import { Box } from '@mui/material';
import { DragControls, motion } from 'framer-motion';
import React from 'react';
import { store } from 'state';

import NowPlayingSurface from './now-playing/NowPlayingSurface';

const MotionBox = motion(Box);
const ReactiveBox = reactive(MotionBox);

const AppBrowser: React.FC<{
  dragControls: DragControls;
}> = ({ dragControls }) => {
  const nowPlayingBool = useSelector(() => !!store.queue.nowPlaying.get());
  const startDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    const dragIcon = document.getElementById('drag-icon') as HTMLInputElement;
    if (dragIcon) {
      dragIcon.setAttribute('data-is-grabbed', 'true');
    }
    dragControls.start(event);
  };

  const endDrag = () => {
    const dragIcon = document.getElementById('drag-icon') as HTMLInputElement;
    if (dragIcon) {
      dragIcon.setAttribute('data-is-grabbed', 'false');
    }
  };

  return (
    <ReactiveBox
      $animate={() => ({
        height: store.ui.overlay.get() ? 'calc(100vh - 148px)' : '100%',
      })}
      alignItems="center"
      display="flex"
      marginX="auto"
      maxWidth={1888}
      width="calc(100% - 32px)"
    >
      <Show if={nowPlayingBool}>
        <NowPlayingSurface endDrag={endDrag} startDrag={startDrag} />
      </Show>
    </ReactiveBox>
  );
};

export default AppBrowser;
