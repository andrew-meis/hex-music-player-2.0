import { observer, reactive, Show, useObservable } from '@legendapp/state/react';
import { Box, ClickAwayListener, Drawer, Typography } from '@mui/material';
import { DateField } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import React, { useRef } from 'react';
import { store } from 'state';

const ReactiveDrawer = reactive(Drawer);

const DateFields: React.FC = observer(function DateFields() {
  const errorText = useObservable('');
  const start = store.ui.drawers.charts.start.get();
  const startRef = useRef<DateTime>(start);
  const end = store.ui.drawers.charts.end.get();
  const endRef = useRef<DateTime>(end);

  return (
    <Box display="flex" flexWrap="wrap" paddingTop={2}>
      <Box marginLeft={1}>
        <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
          Start
        </Typography>
        <DateField
          InputProps={{
            disableUnderline: true,
            slotProps: {
              input: {
                style: {
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                },
              },
            },
          }}
          sx={{
            left: '-0.5rem',
            width: 104,
          }}
          value={start}
          variant="standard"
          onChange={(date) => {
            if (!date) return;
            startRef.current = date;
            if (!date.isValid) {
              errorText.set('Enter a valid start date.');
              return;
            }
            if (date > endRef.current) {
              errorText.set('Start date must be earlier than end date.');
              return;
            }
            errorText.set('');
            return;
          }}
        />
      </Box>
      <Typography marginBottom={0.75} marginRight={1} marginTop="auto">
        &nbsp;–&nbsp;
      </Typography>
      <Box marginLeft={1}>
        <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
          End
        </Typography>
        <DateField
          InputProps={{
            disableUnderline: true,
            slotProps: {
              input: {
                style: {
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                },
              },
            },
          }}
          sx={{
            left: '-0.5rem',
            width: 104,
          }}
          value={end}
          variant="standard"
          onChange={(date) => {
            if (!date) return;
            endRef.current = date;
            if (!date.isValid) {
              errorText.set('Enter a valid end date.');
              return;
            }
            if (date < startRef.current) {
              errorText.set('Start date must be earlier than end date.');
              return;
            }
            errorText.set('');
            return;
          }}
        />
      </Box>
      <Show if={errorText}>
        {() => (
          <Typography color="error" paddingX={1} variant="caption" width={1}>
            {errorText.get()}
          </Typography>
        )}
      </Show>
    </Box>
  );
});

const ChartsDrawer: React.FC = () => {
  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-invisible')) {
      return;
    }
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.charts.open.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.charts.open.get()} anchor="right">
      <ClickAwayListener onClickAway={handleClose}>
        <Box display="flex" flexDirection="column" height={1}>
          <Typography paddingX={1} variant="h5">
            Charts
          </Typography>
          <DateFields />
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default ChartsDrawer;
