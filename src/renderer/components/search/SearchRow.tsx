import TableRow from 'components/row/TableRow';
import React from 'react';
import { ItemProps } from 'react-virtuoso';
import { Result } from 'routes/search/SearchResults';
import { DragTypes, SelectObservable } from 'typescript';

const SearchRow: React.FC<
  {
    children: React.ReactNode;
    index: number;
    state: SelectObservable;
    type: DragTypes;
  } & ItemProps<Result>
> = ({ children, index, state, type, ...props }) => {
  return (
    <TableRow index={index} state={state} type={type} {...props}>
      {children}
    </TableRow>
  );
};

export default SearchRow;
