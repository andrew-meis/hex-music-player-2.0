import { Memo, reactive } from '@legendapp/state/react';
import {
  Box,
  Chip,
  ClickAwayListener,
  Drawer,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Album } from 'api';
import React from 'react';
import { CgArrowLongDown } from 'react-icons/cg';
import { persistedStore, store } from 'state';

const releaseSortOptions = [
  { label: 'Date Added', key: 'addedAt', type: 'date' },
  { label: 'Last Played', key: 'lastViewedAt', type: 'date' },
  { label: 'Playcount', key: 'viewCount', type: 'number' },
  { label: 'Release Date', key: 'originallyAvailableAt', type: 'date' },
  { label: 'Title', key: 'title', type: 'alpha' },
];

const sx = {
  fontFamily: 'Fira Code, monospace',
  fontSize: '10px',
  lineHeight: '9px',
  letterSpacing: '-0.05em',
};

const SortOrderText: React.FC<{
  by: string;
  order: 'asc' | 'desc';
}> = ({ by, order }) => {
  const { type } = releaseSortOptions.find((opt) => opt.key === by)!;

  if (type === 'alpha' && order === 'asc') {
    return (
      <Box height={24} left={-4} position="relative">
        <Typography sx={sx}>A</Typography>
        <Typography sx={sx}>Z</Typography>
      </Box>
    );
  }

  if (type === 'alpha' && order === 'desc') {
    return (
      <Box height={24} left={-4} position="relative">
        <Typography sx={sx}>Z</Typography>
        <Typography sx={sx}>A</Typography>
      </Box>
    );
  }

  if (type === 'number' && order === 'asc') {
    return (
      <Box height={24} left={-4} position="relative">
        <Typography sx={sx}>1</Typography>
        <Typography sx={sx}>9</Typography>
      </Box>
    );
  }

  if (type === 'number' && order === 'desc') {
    return (
      <Box height={24} left={-4} position="relative">
        <Typography sx={sx}>9</Typography>
        <Typography sx={sx}>1</Typography>
      </Box>
    );
  }

  if (type === 'date' && order === 'asc') {
    return (
      <Box height={24} left={-4} position="relative">
        <Typography sx={sx}>OLD</Typography>
        <Typography sx={sx}>NEW</Typography>
      </Box>
    );
  }

  return (
    <Box height={24} left={-4} position="relative">
      <Typography sx={sx}>NEW</Typography>
      <Typography sx={sx}>OLD</Typography>
    </Box>
  );
};

const ReactiveDrawer = reactive(Drawer);
const ReactiveSelect = reactive(Select);

const ArtistOptions: React.FC = () => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    persistedStore.sorting.set((prev) => ({ ...prev, key: event.target.value as keyof Album }));
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.artist.options.open.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.artist.options.open.get()} anchor="right">
      <ClickAwayListener onClickAway={handleClose}>
        <Box>
          <Typography paddingX={1} variant="h5">
            Options
          </Typography>
          <Typography
            color="text.secondary"
            lineHeight={1}
            marginBottom={0.25}
            paddingTop={2}
            paddingX={1}
            variant="subtitle2"
          >
            Sort releases by
          </Typography>
          <Box display="flex" gap="4px">
            <ReactiveSelect
              disableUnderline
              fullWidth
              $value={() => persistedStore.sorting.key.get()}
              MenuProps={{
                MenuListProps: {
                  sx: {
                    padding: '4px 0',
                  },
                },
                slotProps: {
                  paper: {
                    sx: (theme) => ({
                      background: theme.palette.action.selected,
                      marginTop: 0.5,
                    }),
                  },
                },
              }}
              slotProps={{
                input: {
                  sx: {
                    padding: '2px 0',
                    paddingLeft: 1,
                  },
                },
              }}
              sx={(theme) => ({
                borderRadius: 1,
                cursor: 'default',
                height: 36,
                width: '100%',
                '&:hover': {
                  background: theme.palette.action.hover,
                },
              })}
              variant="standard"
              onChange={handleChange}
            >
              {releaseSortOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  <ListItemText>{option.label}</ListItemText>
                </MenuItem>
              ))}
            </ReactiveSelect>
            <Memo>
              {() => {
                const sorting = persistedStore.sorting.get();
                const handleReverseSort = () => {
                  persistedStore.sorting.set((prev) => ({
                    ...prev,
                    order: prev.order === 'asc' ? 'desc' : 'asc',
                  }));
                };
                return (
                  <Chip
                    label={
                      sorting.order === 'asc' ? (
                        <Box display="flex" mt="4px">
                          <SvgIcon viewBox="0 4 24 24">
                            <CgArrowLongDown />
                          </SvgIcon>
                          <SortOrderText by={sorting.key} order={sorting.order} />
                        </Box>
                      ) : (
                        <Box display="flex" mt="4px">
                          <SvgIcon viewBox="0 4 24 24">
                            <CgArrowLongDown />
                          </SvgIcon>
                          <SortOrderText by={sorting.key} order={sorting.order} />
                        </Box>
                      )
                    }
                    sx={(theme) => ({
                      background: 'transparent',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      height: 36,
                      minWidth: 48,
                      paddingLeft: 0,
                      paddingRight: 0,
                      '&:hover': {
                        background: theme.palette.action.hover,
                      },
                      '& .MuiChip-label': {
                        padding: 0,
                        paddingRight: 0.5,
                      },
                    })}
                    onClick={handleReverseSort}
                  />
                );
              }}
            </Memo>
          </Box>
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default ArtistOptions;
