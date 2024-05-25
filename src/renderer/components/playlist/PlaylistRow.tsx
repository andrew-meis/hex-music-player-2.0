import { Playlist } from 'api';
import TableRow from 'components/row/TableRow';
import React from 'react';
import { ItemProps } from 'react-virtuoso';
import { DragTypes, SelectObservable } from 'typescript';

const PlaylistRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    state: SelectObservable;
  } & ItemProps<Playlist>
> = ({ children, index, state, ...props }) => {
  return (
    <TableRow index={index} state={state} type={DragTypes.PLAYLIST} {...props}>
      {children}
    </TableRow>
  );
};

export default PlaylistRow;
