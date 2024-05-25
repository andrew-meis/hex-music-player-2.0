import { observer, Show } from '@legendapp/state/react';
import { Album, Artist, isPlayQueueItem, PlayQueueItem, Track } from 'api';
import TableRow from 'components/row/TableRow';
import { queueActions } from 'features/queue';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemProps } from 'react-virtuoso';
import { store } from 'state';
import { DragTypes, SelectObservable } from 'typescript';

const UpNextRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    lastIndex: number;
    state: SelectObservable;
  } & ItemProps<PlayQueueItem>
> = observer(function UpNextRow({ children, index, lastIndex, state, ...props }) {
  const dropRef = useRef<HTMLElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.ALBUM, DragTypes.ARTIST, DragTypes.PLAYQUEUE_ITEM, DragTypes.TRACK],
      collect: (monitor) => ({ isOver: monitor.isOver() }),
      drop: (item: (PlayQueueItem | Track)[]) => {
        const currentQueue = store.queue.currentQueue.peek();
        const currentIndex = store.queue.currentIndex.peek();
        const target = currentQueue.items.slice(currentIndex)[store.ui.queue.isOverIndex.peek()];
        if (!target) return;
        if (item.every((value) => isPlayQueueItem(value))) {
          queueActions.moveWithinQueue(
            (item as PlayQueueItem[]).map((value) => value.id),
            target.id
          );
          return;
        }
        queueActions.addToQueue(item as (Album | Artist | Track)[], target.id);
      },
      hover: (_item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (!dropRef.current) return;
        const droppableRect = dropRef.current.getBoundingClientRect();
        const topHalfBoundary = droppableRect.top + droppableRect.height / 2;

        if (clientOffset && clientOffset.y < topHalfBoundary) {
          store.ui.queue.isOverIndex.set(index);
        } else {
          store.ui.queue.isOverIndex.set(index + 1);
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (!isOver) {
      store.ui.queue.isOverIndex.set(-1);
    }
  }, [isOver]);

  return (
    <TableRow
      drop={drop}
      dropRef={dropRef}
      index={index}
      state={state}
      sx={{ transform: 'translateZ(0px)' }}
      type={DragTypes.PLAYQUEUE_ITEM}
      {...props}
    >
      <Show if={store.ui.queue.isOverIndex.get() === index} wrap={AnimatePresence}>
        {() => (
          <motion.td
            exit={{
              opacity: 0,
              transition: { delay: 0.025 },
            }}
            style={{
              backgroundColor: 'var(--mui-palette-primary-main)',
              height: 1,
              padding: 0,
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
          />
        )}
      </Show>
      <Show
        if={index === lastIndex && store.ui.queue.isOverIndex.get() === lastIndex + 1}
        wrap={AnimatePresence}
      >
        {() => (
          <motion.td
            exit={{
              opacity: 0,
              transition: { delay: 0.025 },
            }}
            style={{
              backgroundColor: 'var(--mui-palette-primary-main)',
              bottom: 0,
              height: 1,
              padding: 0,
              position: 'absolute',
              width: '100%',
            }}
          />
        )}
      </Show>
      {children}
    </TableRow>
  );
});

export default UpNextRow;
