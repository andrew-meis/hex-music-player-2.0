import {
  observer,
  reactive,
  Show,
  useComputed,
  useObservable,
  useSelector,
} from '@legendapp/state/react';
import {
  Box,
  ClickAwayListener,
  Drawer,
  Slider,
  sliderClasses,
  styled,
  Typography,
} from '@mui/material';
import { DateField } from '@mui/x-date-pickers';
import EditFab from 'components/edit/EditFab';
import { DateTime } from 'luxon';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'state';

const ReactiveDrawer = reactive(Drawer);

const marks = [
  {
    value: 7,
    label: '7',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 90,
    label: '90',
  },
  {
    value: 180,
    label: '180',
  },
  {
    value: 365,
    label: '365',
  },
];

const StyledSlider = styled(Slider)(({ theme }) => {
  return {
    [`& .${sliderClasses.markLabel}`]: {
      top: 20,
      "&[data-index='4']": {
        transform: 'translateX(-90%)',
      },
    },
    [`& .${sliderClasses.thumb}`]: {
      height: 8,
      width: 8,
      borderRadius: 2,
      boxShadow: theme.shadows[1],
      color: theme.palette.common.white,
      '&:hover': {
        boxShadow: theme.shadows[3],
        color: theme.palette.common.white,
      },
    },
  };
});

const isToday = (date: DateTime) => {
  return date.toISODate() === DateTime.local().toISODate();
};

const DaysSlider: React.FC = () => {
  const value = useSelector(() => {
    const start = store.ui.drawers.charts.start.get();
    const end = store.ui.drawers.charts.end.get();
    if (!isToday(end)) return 0;
    const diff = end.diff(start, ['days', 'hours']);
    if (marks.map((mark) => mark.value).includes(diff.days)) {
      return diff.days;
    }
    return 0;
  });

  const handleChange = (_event: Event, newValue: number | number[]) => {
    store.ui.drawers.charts.start.set(
      DateTime.now()
        .startOf('day')
        .minus({ days: newValue as number })
    );
    store.ui.drawers.charts.end.set(DateTime.now().endOf('day'));
  };

  return (
    <Box padding={1} width="calc(100% - 24px)">
      <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
        Last number of days:
      </Typography>
      <StyledSlider
        marks={marks}
        max={365}
        min={0}
        step={null}
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
};

const DateFields: React.FC = observer(function DateFields() {
  const errorText = useObservable('');
  const start = store.ui.drawers.charts.start.get();
  const end = store.ui.drawers.charts.end.get();

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" paddingTop={2} width={1}>
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
            store.ui.drawers.charts.start.set(date.startOf('day'));
            if (!date.isValid) {
              errorText.set('Enter a valid start date.');
              return;
            }
            if (date > end) {
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
            store.ui.drawers.charts.end.set(date.endOf('day'));
            if (!date.isValid) {
              errorText.set('Enter a valid end date.');
              return;
            }
            if (date < start) {
              errorText.set('Start date must be earlier than end date.');
              return;
            }
            errorText.set('');
            return;
          }}
        />
      </Box>
      <Show else={<Box height={20} width={1} />} if={errorText}>
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
  const navigate = useNavigate();

  const isValid = useComputed(() => {
    const start = store.ui.drawers.charts.start.get();
    const end = store.ui.drawers.charts.end.get();
    return start < end;
  });

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-invisible')) {
      return;
    }
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.charts.open.set(false);
    }
  };

  const handleNavigate = () => {
    navigate({
      pathname: '/charts',
      search: new URLSearchParams({
        start: store.ui.drawers.charts.start.peek().toUnixInteger().toString(),
        end: store.ui.drawers.charts.end.peek().toUnixInteger().toString(),
      }).toString(),
    });
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.charts.open.get()} anchor="right">
      <ClickAwayListener onClickAway={handleClose}>
        <Box display="flex" flexDirection="column" height={1}>
          <Typography paddingX={1} variant="h5">
            Charts
          </Typography>
          <DateFields />
          <DaysSlider />
          <EditFab isVisible={isValid} onClick={handleNavigate} />
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default ChartsDrawer;
