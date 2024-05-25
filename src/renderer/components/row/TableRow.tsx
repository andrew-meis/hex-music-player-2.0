import { useSelector } from '@legendapp/state/react';
import { Box, BoxProps } from '@mui/material';
import { selectActions } from 'features/select';
import { useEffect } from 'react';
import { ConnectDropTarget, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { store } from 'state';
import { DragTypes, SelectObservable } from 'typescript';

export interface RowOptions {
  showType?: boolean;
}

const TableRow = ({
  children,
  drop,
  dropRef,
  index,
  state,
  sx,
  type,
  ...props
}: {
  drop?: ConnectDropTarget;
  dropRef?: React.MutableRefObject<HTMLElement | null>;
  index: number;
  state: SelectObservable;
  type: DragTypes;
} & BoxProps) => {
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
    if (state.selectedIndexes.peek().includes(index)) return;
    state.selectedIndexes.set([index]);
  };

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  if (drop && dropRef) {
    drag(drop(dropRef));
  }

  return (
    <Box
      alignItems="center"
      bgcolor={isSelected ? 'action.selected' : 'transparent'}
      component="tr"
      display="flex"
      height={64}
      ref={drop ? dropRef : drag}
      sx={{
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
      onClick={(event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) =>
        selectActions.handleSelect(event, index, state)
      }
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      {...props}
    >
      {children}
    </Box>
  );
};

export default TableRow;
