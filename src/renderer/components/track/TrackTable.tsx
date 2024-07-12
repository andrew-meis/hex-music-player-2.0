import { ClickAwayListener } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Track } from 'api';
import { selectActions } from 'features/select';
import React, { useMemo } from 'react';
import { store } from 'state';
import { SelectObservable, SelectObservables } from 'typescript';

import { trackColumns } from './columns';
import TrackRow from './TrackRow';

const TrackTable: React.FC<{
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
                <td className={cell.column.id} key={cell.id} style={{ padding: '0 8px' }}>
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
