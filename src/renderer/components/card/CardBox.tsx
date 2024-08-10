import { useSelector } from '@legendapp/state/react';
import { Box, BoxProps } from '@mui/material';
import { selectActions } from 'features/select';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { store } from 'state';
import { DragTypes, SelectObservable } from 'typescript';

const MotionBox = motion(Box);

const CardBox: React.FC<
  {
    index: number;
    type: DragTypes;
    state: SelectObservable;
  } & React.ComponentProps<typeof MotionBox> &
    BoxProps
> = ({ index, state, sx, type, ...props }) => {
  const isDragging = useSelector(() => store.ui.isDragging.get());
  const isSelected = useSelector(() => state.selectedIndexes.get().includes(index));

  const [, drag, dragPreview] = useDrag(
    () => ({
      item: () => state.selectedItems.peek(),
      type,
      end: () => {
        store.ui.queue.isOverIndex.set(-1);
        state.selectedIndexes.set([]);
      },
    }),
    []
  );

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!isSelected) {
      state.selectedIndexes.set([index]);
    }
    store.ui.menus.anchorPosition.set({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const handleDragStart = () => {
    console.log('setting state', index);
    if (state.selectedIndexes.peek().includes(index)) return;
    state.selectedIndexes.set([index]);
  };

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  return (
    <MotionBox
      bgcolor={isSelected ? 'action.selected' : 'transparent'}
      initial="initial"
      sx={{
        borderRadius: 2,
        contain: 'paint',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'background-color 100ms ease-in-out',
        '&:hover': {
          backgroundColor: isSelected
            ? isDragging
              ? 'action.selected'
              : 'action.hoverSelected'
            : isDragging
              ? 'transparent'
              : 'action.hover',
        },
        ...sx,
      }}
      whileHover={isDragging ? 'initial' : 'hover'}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        selectActions.handleSelect(event, index, state)
      }
      onContextMenu={handleContextMenu}
      {...props}
    >
      <div ref={drag} style={{ width: '100%', height: '100%' }} onDragStart={handleDragStart}>
        {props.children}
      </div>
    </MotionBox>
  );
};

export default CardBox;
