import { Collection } from 'api';
import TableRow from 'components/row/TableRow';
import React from 'react';
import { ItemProps } from 'react-virtuoso';
import { DragTypes, SelectObservable } from 'typescript';

const CollectionRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    state: SelectObservable;
  } & ItemProps<Collection>
> = ({ children, index, state, ...props }) => {
  return (
    <TableRow index={index} state={state} type={DragTypes.COLLECTION} {...props}>
      {children}
    </TableRow>
  );
};

export default CollectionRow;
