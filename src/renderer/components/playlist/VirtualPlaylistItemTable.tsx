import { ClickAwayListener } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { PlaylistItem } from 'api';
import { selectActions } from 'features/select';
import React, { useMemo } from 'react';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { store } from 'state';
import { SelectObservable, SelectObservables } from 'typescript';

import { playlistColumns } from './columns';
import PlaylistItemRow from './PlaylistItemRow';

const VirtualPlaylistItemTable: React.FC<{
  activeMenu: SelectObservables;
  items: PlaylistItem[];
  state: SelectObservable;
  viewport: HTMLDivElement | undefined;
}> = ({ activeMenu, items, state, viewport }) => {
  const columns = useMemo(() => playlistColumns, []);

  const table = useReactTable({
    data: items,
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
          TableRow: (props: ItemProps<PlaylistItem>) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <PlaylistItemRow index={index} state={state} {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </PlaylistItemRow>
            );
          },
        }}
        customScrollParent={viewport}
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
          state.items.set(items);
        }}
      />
    </ClickAwayListener>
  );
};

export default VirtualPlaylistItemTable;
