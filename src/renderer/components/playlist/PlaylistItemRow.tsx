import { PlaylistItem } from 'api';
import TableRow from 'components/row/TableRow';
import React from 'react';
import { ItemProps } from 'react-virtuoso';
import { DragTypes, SelectObservable } from 'typescript';

const PlaylistItemRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    state: SelectObservable;
  } & ItemProps<PlaylistItem>
> = ({ children, index, state, ...props }) => {
  return (
    <TableRow index={index} state={state} type={DragTypes.PLAYLIST_ITEM} {...props}>
      {children}
    </TableRow>
  );
};

export default PlaylistItemRow;
