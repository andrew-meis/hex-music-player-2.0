import { createColumnHelper } from '@tanstack/react-table';
import { Track } from 'api';
import Thumb from 'components/virtuoso/table-cells/Thumb';
import TrackRating from 'components/virtuoso/table-cells/TrackRating';
import TrackTitle from 'components/virtuoso/table-cells/TrackTitle';
import Title from 'components/virtuoso/table-headers/Title';

const columnHelper = createColumnHelper<Track>();

export const trackColumns = [
  columnHelper.accessor('thumb', {
    cell: (info) => <Thumb title={info.row.original.title} type="track" url={info.getValue()} />,
    header: () => '',
  }),
  columnHelper.accessor('title', {
    cell: (info) => {
      return <TrackTitle showType={false} track={info.row.original} />;
    },
    header: () => <Title />,
  }),
  columnHelper.accessor('userRating', {
    cell: (info) => {
      return <TrackRating track={info.row.original} />;
    },
    header: () => '',
  }),
];
