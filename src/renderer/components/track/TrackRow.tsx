import { Track } from 'api';
import TableRow from 'components/row/TableRow';
import React from 'react';
import { ItemProps } from 'react-virtuoso';
import { DragTypes, SelectObservable } from 'typescript';

const TrackRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    state: SelectObservable;
  } & ItemProps<Track>
> = ({ children, index, state, ...props }) => {
  return (
    <TableRow index={index} state={state} type={DragTypes.TRACK} {...props}>
      {children}
    </TableRow>
  );
};

export default TrackRow;
