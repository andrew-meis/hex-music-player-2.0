import { ClickAwayListener } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Track } from 'api';
import { selectActions } from 'features/select';
import React, { useMemo } from 'react';
import { store } from 'state';
import { SelectObservable, SelectObservables } from 'typescript';

import { getTrackColumns, TrackColumnOptions } from './columns';
import TrackRow from './TrackRow';

const TrackTable: React.FC<{
  tracks: Track[];
  activeMenu: SelectObservables;
  columnOptions?: Partial<TrackColumnOptions>;
  state: SelectObservable;
}> = ({ tracks, activeMenu, columnOptions, state }) => {
  const columns = useMemo(() => getTrackColumns(columnOptions), []);

  const table = useReactTable({
    data: tracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: { parentIndex: false },
      expanded: true,
    },
  });

  return (
    <ClickAwayListener onClickAway={(event) => selectActions.handleClickAway(state, event)}>
      <table
        style={{
          borderSpacing: 0,
          tableLayout: 'fixed',
          width: '-webkit-fill-available',
        }}
        onMouseOver={() => {
          store.ui.menus.activeMenu.set(activeMenu);
          state.items.set(tracks);
        }}
      >
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <TrackRow index={index} key={row.id} state={state}>
              {row.getVisibleCells().map((cell) => (
                <td className={cell.column.id} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </TrackRow>
          ))}
        </tbody>
      </table>
    </ClickAwayListener>
  );
};

export default TrackTable;
