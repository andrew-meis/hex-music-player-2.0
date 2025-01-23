import { observer } from '@legendapp/state/react';
import { Box, Tooltip, tooltipClasses, Typography } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { HistoryContainer, HistoryEntry } from 'api';
import chroma from 'chroma-js';
import { historyColumns } from 'components/history/columns';
import Scroller from 'components/virtuoso/Scroller';
import { groupBy, sum } from 'lodash';
import { DateTime } from 'luxon';
import { useHistory } from 'queries';
import { useMemo, useState } from 'react';
import React from 'react';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import formatCount from 'scripts/format-count';
import { store } from 'state';

const makeEquidistantValues = (startValue: number, stopValue: number, cardinality: number) => {
  const arr: number[] = [];
  const step = (stopValue - startValue) / (cardinality - 1);
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i);
  }
  return arr.map((x) => Math.round(x * 100) / 100);
};

const BarChart: React.FC<{ history: HistoryContainer }> = observer(function BarChart({ history }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const palette = store.ui.nowPlaying.palette.get();

  const moments = useMemo(
    () => history.entries.map((entry) => DateTime.fromJSDate(entry.viewedAt)),
    [history]
  );

  const data = useMemo(() => groupBy(moments, (date) => date.toFormat('yyyy')), [moments]);

  const chromaColors = Object.entries(palette)
    .map(([, swatch]) => {
      if (swatch) {
        return chroma(swatch.rgb);
      } else {
        return null;
      }
    })
    .filter((color) => color !== null);

  const colors = useMemo(() => {
    const surfaceColor = '#000';
    const { length } = Object.entries(data);
    let saturationValues: number[];
    let luminanceValues: number[];
    if (length <= 1) {
      saturationValues = [0.5];
      luminanceValues = [0.5];
    } else {
      saturationValues = makeEquidistantValues(0.2, 0.8, length);
      luminanceValues = makeEquidistantValues(0.4, 0.6, length);
    }
    const filteredPalette = chromaColors.filter(
      (color) => Math.max(...color.rgb()) - Math.min(...color.rgb()) > 10
    );
    let maxContrastIndex: number;
    if (filteredPalette.length > 0) {
      maxContrastIndex = filteredPalette.reduce(
        (max, x, i, arr) =>
          chroma.contrast(surfaceColor, x) > chroma.contrast(surfaceColor, arr[max]) ? i : max,
        0
      );
      return Object.entries(data).map((_value, index) =>
        filteredPalette[maxContrastIndex].set('hsv.s', saturationValues[index]).hex()
      );
    } else {
      return Object.entries(data).map((_value, index) =>
        chroma('#808080').set('hsl.l', luminanceValues[index]).hex()
      );
    }
  }, [data, chromaColors]);

  return (
    <>
      <Box
        alignItems="flex-end"
        color="text.secondary"
        display="flex"
        height={32}
        justifyContent="space-between"
      >
        <Typography>{Object.keys(data).at(0)}</Typography>
        <Typography>{Object.keys(data).at(-1)}</Typography>
      </Box>
      <Box display="flex" minHeight={21}>
        {Object.entries(data).map((entry, index, array) => {
          const year = entry[0];
          const length = entry[1].length;
          const total = sum(array.map((entry) => entry[1].length));
          return (
            <Tooltip
              key={year}
              slotProps={{
                popper: {
                  sx: {
                    [`&[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
                      marginTop: 0.5,
                    },
                  },
                },
              }}
              title={
                <Typography variant="subtitle1">{`${year} · ${formatCount(length, 'play', 'plays')}`}</Typography>
              }
              onClose={() => setActiveIndex(-1)}
              onOpen={() => setActiveIndex(index)}
            >
              <Box
                bgcolor={activeIndex === index || activeIndex === -1 ? colors[index] : '#808080'}
                borderRadius={0.5}
                key={year}
                marginRight={index !== array.length - 1 ? '2px' : ''}
                sx={{
                  filter: activeIndex === index ? 'brightness(120%)' : null,
                  opacity: activeIndex === index || activeIndex === -1 ? 1 : 0.3,
                  transition: '300ms',
                }}
                width={length / total}
              />
            </Tooltip>
          );
        })}
      </Box>
    </>
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
      fixedHeaderContent={() => {
        return (
          <>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="history-row" key={headerGroup.id} style={{ pointerEvents: 'none' }}>
                {headerGroup.headers.map((header) => (
                  <th className={header.column.id} key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </>
        );
      }}
      style={{
        height: '100%',
        marginTop: 16,
        marginBottom: 16,
        overscrollBehavior: 'contain',
        width: '100%',
        zIndex: 100,
      }}
      totalCount={rows.length}
    />
  );
};

const NowPlayingHistory: React.FC = observer(function NowPlayingHistory() {
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: history } = useHistory(nowPlaying.track.id);

  if (!history) return null;

  if (history.size === 0) {
    return (
      <Box alignItems="center" display="flex" height={1} justifyContent="center" width={1}>
        <Typography color="text.secondary" variant="h4">
          No playback history.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height={1} width={1}>
      <BarChart history={history} />
      <Table history={history} />
    </Box>
  );
});

export default NowPlayingHistory;
