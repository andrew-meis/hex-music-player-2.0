import { createColumnHelper } from '@tanstack/react-table';
import { Artist } from 'api';
import ArtistTitle from 'components/virtuoso/table-cells/ArtistTitle';
import Thumb from 'components/virtuoso/table-cells/Thumb';
import Title from 'components/virtuoso/table-headers/Title';

export interface ArtistColumnOptions {
  title: {
    showArtistType?: boolean;
    showDefaultSubtext?: boolean;
  };
}

const columnHelper = createColumnHelper<Artist>();

export const getArtistColumns = (options?: Partial<ArtistColumnOptions>) => [
  columnHelper.accessor('thumb', {
    cell: (info) => <Thumb title={info.row.original.title} type="artist" url={info.getValue()} />,
    header: () => '',
  }),
  columnHelper.accessor('title', {
    cell: (info) => {
      return (
        <ArtistTitle
          artist={info.row.original}
          showArtistType={options?.title?.showArtistType}
          showDefaultSubtext={options?.title?.showDefaultSubtext}
          showType={false}
        />
      );
    },
    header: () => <Title />,
  }),
];
