import { createColumnHelper } from '@tanstack/react-table';
import { PlaylistItem } from 'api';
import Thumb from 'components/virtuoso/table-cells/Thumb';
import TrackRating from 'components/virtuoso/table-cells/TrackRating';
import TrackTitle from 'components/virtuoso/table-cells/TrackTitle';
import Title from 'components/virtuoso/table-headers/Title';

const columnHelper = createColumnHelper<PlaylistItem>();

export const playlistColumns = [
  columnHelper.accessor('track.thumb', {
    cell: (info) => (
      <Thumb title={info.row.original.track.title} type="track" url={info.getValue()} />
    ),
    header: () => '',
  }),
  columnHelper.accessor('track.title', {
    cell: (info) => {
      return <TrackTitle showType={false} track={info.row.original.track} />;
    },
    header: () => <Title />,
  }),
  columnHelper.accessor('track.userRating', {
    cell: (info) => {
      return <TrackRating track={info.row.original.track} />;
    },
    header: () => '',
  }),
];
