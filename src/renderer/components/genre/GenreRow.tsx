import { Genre } from 'api';
import TableRow from 'components/row/TableRow';
import React from 'react';
import { ItemProps } from 'react-virtuoso';
import { DragTypes, SelectObservable } from 'typescript';

const GenreRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    state: SelectObservable;
  } & ItemProps<Genre>
> = ({ children, index, state, ...props }) => {
  return (
    <TableRow index={index} state={state} type={DragTypes.GENRE} {...props}>
      {children}
    </TableRow>
  );
};

export default GenreRow;
