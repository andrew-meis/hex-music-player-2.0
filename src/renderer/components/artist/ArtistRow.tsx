import { Artist } from 'api';
import TableRow from 'components/row/TableRow';
import React from 'react';
import { ItemProps } from 'react-virtuoso';
import { DragTypes, SelectObservable } from 'typescript';

const ArtistRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    state: SelectObservable;
  } & Partial<ItemProps<Artist>>
> = ({ children, index, state, ...props }) => {
  return (
    <TableRow index={index} state={state} type={DragTypes.ARTIST} {...props}>
      {children}
    </TableRow>
  );
};

export default ArtistRow;
