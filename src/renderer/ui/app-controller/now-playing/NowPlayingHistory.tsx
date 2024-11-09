import { observer } from '@legendapp/state/react';
import { Box, styled, Typography, useColorScheme } from '@mui/material';
import { PieChart, useDrawingArea } from '@mui/x-charts';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { HistoryContainer, HistoryEntry } from 'api';
import chroma from 'chroma-js';
import { historyColumns } from 'components/history/columns';
import Scroller from 'components/virtuoso/Scroller';
import { groupBy } from 'lodash';
import { DateTime } from 'luxon';
import { useHistory } from 'queries';
import { useMemo } from 'react';
import React from 'react';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { store } from 'state';

const makeEquidistantValues = (startValue: number, stopValue: number, cardinality: number) => {
  const arr: number[] = [];
  const step = (stopValue - startValue) / (cardinality - 1);
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i);
  }
  return arr.map((x) => Math.round(x * 100) / 100);
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontFamily: 'Arimo, Arial, sans-serif',
  fontSize: '1.125rem',
  fontWeight: 600,
}));

const PieCenterLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
};

const Chart: React.FC<{ history: HistoryContainer }> = observer(function Chart({ history }) {
  const palette = store.ui.nowPlaying.palette.get();

  const { mode } = useColorScheme();

  const moments = useMemo(
    () => history.entries.map((entry) => DateTime.fromJSDate(entry.viewedAt)),
    [history]
  );

  const data = useMemo(() => {
    const groupsYears = groupBy(moments, (date) => date.toFormat('yyyy'));
    const years = Object.keys(groupsYears)
      .map((key, index) => ({
        id: index,
        label: key,
        value: groupsYears[key].length,
        entries: groupsYears[key],
      }))
      .sort((a, b) => parseInt(a.label, 10) - parseInt(b.label, 10));
    return years;
  }, [moments]);

  const colors = useMemo(() => {
    const surfaceColor = chroma(mode === 'dark' ? '#121212' : '#ffffff');
    let saturationValues: number[];
    let luminanceValues: number[];
    if (data.length <= 1) {
      saturationValues = [0.5];
      luminanceValues = [0.5];
    } else {
      saturationValues = makeEquidistantValues(0.2, 0.8, data.length);
      luminanceValues = makeEquidistantValues(0.4, 0.6, data.length);
    }
    const filteredPalette = palette.filter(
      (color) => Math.max(...color.rgb()) - Math.min(...color.rgb()) > 10
    );
    let maxContrastIndex: number;
    if (filteredPalette.length > 0) {
      maxContrastIndex = filteredPalette.reduce(
        (max, x, i, arr) =>
          chroma.contrast(surfaceColor, x) > chroma.contrast(surfaceColor, arr[max]) ? i : max,
        0
      );
      return data.map((_value, index) =>
        filteredPalette[maxContrastIndex].set('hsv.s', saturationValues[index]).hex()
      );
    } else {
      return data.map((_value, index) =>
        chroma('#808080').set('hsl.l', luminanceValues[index]).hex()
      );
    }
  }, [data, mode, palette]);

  return (
    <PieChart
      colors={colors}
      margin={{ top: 32, right: 32, bottom: 32, left: 0 }}
      series={[
        {
          data,
          innerRadius: '60%',
          paddingAngle: 2,
          cornerRadius: 4,
          startAngle: -45,
          endAngle: 225,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { color: 'rgb(128, 128, 128)' },
          valueFormatter: ({ value }) => (value > 1 ? `${value} plays` : `${value} play`),
        },
      ]}
      slotProps={{
        legend: {
          hidden: true,
        },
        noDataOverlay: {
          transform: 'translate(24, 0)',
          x: '50%',
          y: '50%',
        },
      }}
      sx={{
        '& .MuiPieArc-root': {
          stroke: 'transparent',
          strokeWidth: '2px',
        },
      }}
    >
      <PieCenterLabel>
        {history.entries.length > 1
          ? `${history.entries.length} plays`
          : `${history.entries.length} play`}
      </PieCenterLabel>
    </PieChart>
  );
});

const Table: React.FC<{ history: HistoryContainer }> = ({ history }) => {
  const columns = useMemo(() => historyColumns, []);
  const entries = useMemo(() => history.entries.toReversed(), [history]);

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  return (
    <>
      <table style={{ width: '-webkit-fill-available', tableLayout: 'fixed' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="history-row" key={headerGroup.id} style={{ pointerEvents: 'none' }}>
              {headerGroup.headers.map((header) => (
                <th className={header.column.id} key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      </table>
      <TableVirtuoso
        components={{
          Scroller,
          Table: ({ style, ...props }: TableProps) => (
            <table
              {...props}
              style={{
                ...style,
                width: '-webkit-fill-available',
                tableLayout: 'fixed',
              }}
            />
          ),
          TableRow: ({ style, ...props }: ItemProps<HistoryEntry>) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <tr className="history-row" {...props} style={{ ...style }}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          },
        }}
        style={{
          height: 'calc(100% - 29px)',
          marginBottom: 16,
          overscrollBehavior: 'contain',
          width: '100%',
          zIndex: 100,
        }}
        totalCount={rows.length}
      />
    </>
  );
};

const NowPlayingHistory: React.FC = observer(function NowPlayingHistory() {
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: history } = useHistory(nowPlaying.track.id);

  if (!history) return null;

  if (history.size === 0) {
    return (
      <Box
        alignItems="center"
        display="flex"
        height="-webkit-fill-available"
        justifyContent="center"
        margin={2}
        width="calc(100% - 32px)"
      >
        <Typography color="text.secondary" variant="h5">
          ...no play history...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      height="-webkit-fill-available"
      margin={2}
      marginLeft={6}
      width="calc(100% - 64px)"
    >
      <Box flexShrink={0} width={history.entries.length === 0 ? 1 : 0.4}>
        <Chart history={history} />
      </Box>
      <Box flexGrow={1} height="calc(100% - 32px)" width="calc(60% - 48px)">
        <Table history={history} />
      </Box>
    </Box>
  );
});

export default NowPlayingHistory;
