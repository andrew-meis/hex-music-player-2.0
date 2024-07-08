import { ClickAwayListener } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Track } from 'api';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import React, { useMemo } from 'react';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { store } from 'state';
import { SelectObservable, SelectObservables } from 'typescript';

import { trackColumns } from './columns';
import TrackRow from './TrackRow';

const VirtualTrackTable: React.FC<{
  tracks: Track[];
  activeMenu: SelectObservables;
  state: SelectObservable;
}> = ({ tracks, activeMenu, state }) => {
  const columns = useMemo(() => trackColumns, []);

  const table = useReactTable({
    data: tracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          TableRow: (props: ItemProps<Track>) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <TrackRow index={index} state={state} {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cell.column.id} key={cell.id} style={{ padding: '0 8px' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </TrackRow>
            );
          },
        }}
        isScrolling={handleScrollState}
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
