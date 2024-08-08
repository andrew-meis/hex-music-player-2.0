import { ClickAwayListener } from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table';
import { Track } from 'api';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import React, { useMemo, useState } from 'react';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { store } from 'state';
import { SelectObservable, SelectObservables } from 'typescript';

import { getTrackColumns, TrackColumnOptions } from './columns';
import TrackRow from './TrackRow';

const VirtualTrackTable: React.FC<{
  activeMenu: SelectObservables;
  columnGrouping?: GroupingState;
  columnOptions?: Partial<TrackColumnOptions>;
  columnVisibility?: Partial<Record<keyof Track, boolean>>;
  state: SelectObservable;
  tracks: Track[];
  useWindowScroll?: boolean;
  viewport?: HTMLDivElement;
}> = ({
  activeMenu,
  columnGrouping,
  columnOptions,
  columnVisibility,
  state,
  tracks,
  useWindowScroll = false,
  viewport,
}) => {
  const columns = useMemo(() => getTrackColumns(columnOptions), []);
  const [grouping, setGrouping] = useState<GroupingState>(columnGrouping || []);

  const table = useReactTable({
    data: tracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onGroupingChange: setGrouping,
    state: {
      columnVisibility,
      expanded: true,
      grouping,
    },
  });

  const { rows } = table.getRowModel();

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  return (
    <ClickAwayListener onClickAway={(event) => selectActions.handleClickAway(state, event)}>
      <TableVirtuoso
        components={
          useWindowScroll
            ? {
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
                TableRow: (props: ItemProps<Track>) => {
                  const index = props['data-index'];
                  const row = rows[index];
                  if (row.getIsGrouped()) {
                    return <tr {...props} style={{ height: 32, ...props.style }} />;
                  }
                  return (
                    <TrackRow
                      index={tracks.findIndex((track) => track.id === row.original.id)}
                      state={state}
                      {...props}
                    >
                      {row
                        .getVisibleCells()
                        .filter(({ column }) => !['parentIndex'].includes(column.id))
                        .map((cell) => (
                          <td className={cell.column.id} key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                    </TrackRow>
                  );
                },
              }
            : {
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
                TableRow: (props: ItemProps<Track>) => {
                  const index = props['data-index'];
                  const row = rows[index];
                  if (row.getIsGrouped()) {
                    return <tr {...props} style={{ height: 64, ...props.style }} />;
                  }
                  return (
                    <TrackRow
                      index={tracks.findIndex((track) => track.id === row.original.id)}
                      state={state}
                      {...props}
                    >
                      {row
                        .getVisibleCells()
                        .filter(({ column }) => !['parentIndex'].includes(column.id))
                        .map((cell) => (
                          <td className={cell.column.id} key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                    </TrackRow>
                  );
                },
              }
        }
        customScrollParent={useWindowScroll ? viewport : undefined}
        isScrolling={handleScrollState}
        itemContent={(index) => {
          const row = table.getRowModel().rows[index];
          if (row.getIsGrouped()) {
            const cell = row.getVisibleCells().find(({ column }) => column.id === 'parentIndex')!;
            return (
              <td colSpan={100} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          }
          return undefined;
        }}
        style={{
          height: 'calc(100% - 16px)',
          marginTop: 16,
          overscrollBehavior: 'contain',
          width: '100%',
        }}
        totalCount={rows.length}
        onMouseOver={() => {
          store.ui.menus.activeMenu.set(activeMenu);
          state.items.set(tracks);
        }}
      />
    </ClickAwayListener>
  );
};

export default VirtualTrackTable;
