import { createColumnHelper } from '@tanstack/react-table';
import { Track } from 'api';
import Discnumber from 'components/virtuoso/table-cells/Discnumber';
import Duration from 'components/virtuoso/table-cells/Duration';
import Thumb from 'components/virtuoso/table-cells/Thumb';
import Tracknumber from 'components/virtuoso/table-cells/Tracknumber';
import TrackRating from 'components/virtuoso/table-cells/TrackRating';
import TrackTitle from 'components/virtuoso/table-cells/TrackTitle';
import Title from 'components/virtuoso/table-headers/Title';

export interface TrackColumnOptions {
  title: {
    showAlbumTitle: boolean;
  };
  userRating: {
    showSubtext: 'playcount' | 'popularity';
  };
}

const columnHelper = createColumnHelper<Track>();

export const getTrackColumns = (options?: Partial<TrackColumnOptions>) => [
  columnHelper.accessor('parentIndex', {
    cell: (info) => <Discnumber discnumber={info.getValue()} />,
    header: () => '',
  }),
  columnHelper.accessor('index', {
    cell: (info) => <Tracknumber tracknumber={info.getValue()} />,
    header: () => '',
  }),
  columnHelper.accessor('thumb', {
    cell: (info) => <Thumb title={info.row.original.title} type="track" url={info.getValue()} />,
    header: () => '',
  }),
  columnHelper.accessor('title', {
    cell: (info) => {
      return (
        <TrackTitle
          showAlbumTitle={options?.title?.showAlbumTitle}
          showType={false}
          track={info.row.original}
        />
      );
    },
    header: () => <Title />,
  }),
  columnHelper.accessor('userRating', {
    cell: (info) => {
      return (
        <TrackRating showSubtext={options?.userRating?.showSubtext} track={info.row.original} />
      );
    },
    header: () => '',
  }),
  columnHelper.accessor('duration', {
    cell: (info) => <Duration duration={info.getValue()} />,
    header: () => '',
  }),
];
