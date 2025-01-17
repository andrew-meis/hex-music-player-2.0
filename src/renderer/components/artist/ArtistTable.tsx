import { ClickAwayListener } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Artist } from 'api';
import { selectActions } from 'features/select';
import React, { useMemo } from 'react';
import { store } from 'state';
import { SelectObservable, SelectObservables } from 'typescript';

import ArtistRow from './ArtistRow';
import { ArtistColumnOptions, getArtistColumns } from './columns';

const ArtistTable: React.FC<{
  activeMenu: SelectObservables;
  artists: Artist[];
  columnOptions?: Partial<ArtistColumnOptions>;
  columnVisibility?: Partial<Record<keyof Artist, boolean>>;
  state: SelectObservable;
}> = ({ activeMenu, columnOptions, columnVisibility, state, artists }) => {
  const columns = useMemo(() => getArtistColumns(columnOptions), []);

  const table = useReactTable({
    data: artists,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
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
          state.items.set(artists);
        }}
      >
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <ArtistRow index={index} key={row.id} state={state}>
              {row.getVisibleCells().map((cell) => (
                <td className={cell.column.id} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </ArtistRow>
          ))}
        </tbody>
      </table>
    </ClickAwayListener>
  );
};

export default ArtistTable;
