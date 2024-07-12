import { useWidth } from 'hooks/useWidth';
import React from 'react';
import { GridItemProps, GridListProps } from 'react-virtuoso';

const List = React.forwardRef<HTMLDivElement, GridListProps>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {children}
    </div>
  )
);

List.displayName = 'List';

const breakpointMap = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6,
};

const Item: React.FC<GridItemProps> = ({ children, ...props }) => {
  const breakpoint = useWidth();
  return (
    <div
      {...props}
      style={{
        padding: 4,
        width: `${Math.floor(100 / breakpointMap[breakpoint])}%`,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

export { Item, List };
