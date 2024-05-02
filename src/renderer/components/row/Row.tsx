import { useSelector } from '@legendapp/state/react';
import { Box, BoxProps } from '@mui/material';
import { store } from 'state';
import { selectActions } from 'ui/select';

export interface RowOptions {
  showType?: boolean;
}

const Row = ({ children, index, ...props }: BoxProps & { index: number }) => {
  const isSelected = useSelector(() => store.ui.select.selected.get().includes(index));

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!isSelected) {
      store.ui.select.selected.set([index]);
    }
    store.ui.menus.anchorPosition.set({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  return (
    <Box
      {...props}
      alignItems="center"
      bgcolor={isSelected ? 'action.selected' : 'transparent'}
      border="1px solid transparent"
      borderRadius={1}
      display="flex"
      height={62}
      sx={{
        transition: 'background-color 100ms ease-in-out',
        '&:hover': {
          backgroundColor: isSelected ? 'action.hoverSelected' : 'action.hover',
        },
      }}
      onClick={(event) => selectActions.handleSelect(event, index)}
      onContextMenu={handleContextMenu}
    >
      {children}
    </Box>
  );
};

export default Row;
