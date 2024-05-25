import { createColumnHelper } from '@tanstack/react-table';
import { PlayQueueItem } from 'api';
import Thumb from 'components/virtuoso/table-cells/Thumb';
import TrackTitle from 'components/virtuoso/table-cells/TrackTitle';
import Title from 'components/virtuoso/table-headers/Title';

const columnHelper = createColumnHelper<PlayQueueItem>();

export const queueColumns = [
  columnHelper.accessor('track.thumb', {
    cell: (info) => (
      <Thumb title={info.row.original.track.title} type="track" url={info.getValue()} />
    ),
    header: () => '',
  }),
  columnHelper.accessor('track.title', {
    cell: (info) => {
      const { track } = info.row.original;
      return <TrackTitle track={track} />;
    },
    header: () => <Title />,
  }),
];
