import { createColumnHelper } from '@tanstack/react-table';
import { isAlbum, isArtist, isCollection, isGenre, isPlaylist, isTrack } from 'api';
import AlbumTitle from 'components/virtuoso/table-cells/AlbumTitle';
import ArtistTitle from 'components/virtuoso/table-cells/ArtistTitle';
import CollectionTitle from 'components/virtuoso/table-cells/CollectionTitle';
import GenreTitle from 'components/virtuoso/table-cells/GenreTitle';
import PlaylistTitle from 'components/virtuoso/table-cells/PlaylistTitle';
import Thumb from 'components/virtuoso/table-cells/Thumb';
import TrackTitle from 'components/virtuoso/table-cells/TrackTitle';
import Title from 'components/virtuoso/table-headers/Title';
import { Result } from 'routes/search/SearchResults';

const columnHelper = createColumnHelper<Result>();

export const searchColumns = [
  columnHelper.accessor('thumb', {
    cell: (info) => {
      const { original } = info.row;
      return (
        <>
          {isAlbum(original) && <Thumb title={original.title} type="album" url={original.thumb} />}
          {isArtist(original) && (
            <Thumb title={original.title} type="artist" url={original.thumb} />
          )}
          {isCollection(original) && (
            <Thumb title={original.title} type="collection" url={original.thumb} />
          )}
          {isGenre(original) && <Thumb title={original.title} type="genre" url={undefined} />}
          {isPlaylist(original) && (
            <Thumb
              title={original.title}
              type="playlist"
              url={original.thumb || original.composite || undefined}
            />
          )}
          {isTrack(original) && <Thumb title={original.title} type="track" url={original.thumb} />}
        </>
      );
    },
    header: () => '',
  }),
  columnHelper.accessor('title', {
    cell: (info) => {
      const { original } = info.row;
      return (
        <>
          {isAlbum(original) && <AlbumTitle showType album={original} />}
          {isArtist(original) && <ArtistTitle showType artist={original} />}
          {isCollection(original) && <CollectionTitle showType collection={original} />}
          {isGenre(original) && <GenreTitle showType genre={original} />}
          {isPlaylist(original) && <PlaylistTitle showType playlist={original} />}
          {isTrack(original) && <TrackTitle showType track={original} />}
        </>
      );
    },
    header: () => <Title />,
  }),
];
