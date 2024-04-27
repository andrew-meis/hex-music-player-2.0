import {
  Album,
  Artist,
  Genre,
  isAlbum,
  isArtist,
  isGenre,
  isPlaylist,
  isTrack,
  Playlist,
  Track,
} from 'api';
import AlbumRow from 'components/album/AlbumRow';
import ArtistRow from 'components/artist/ArtistRow';
import GenreRow from 'components/genre/GenreRow';
import PlaylistRow from 'components/playlist/PlaylistRow';
import TrackRow from 'components/track/TrackRow';
import Scroller from 'components/virtuoso/Scroller';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';

const Item: React.FC<{
  data: Artist | Album | Track | Playlist | Genre;
}> = ({ data }) => (
  <>
    {isAlbum(data) && <AlbumRow album={data} />}
    {isArtist(data) && <ArtistRow artist={data} />}
    {isGenre(data) && <GenreRow genre={data} />}
    {isPlaylist(data) && <PlaylistRow playlist={data} />}
    {isTrack(data) && <TrackRow options={{ showType: true }} track={data} />}
  </>
);

const SearchResults: React.FC<{
  searchResults: (Artist | Album | Track | Playlist | Genre)[];
}> = ({ searchResults }) => {
  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  return (
    <Virtuoso
      components={{
        Scroller,
      }}
      data={searchResults}
      isScrolling={handleScrollState}
      itemContent={(_index, data) => <Item data={data} />}
      style={{ height: '100%', marginBottom: 16, marginTop: 16 }}
    />
  );
};

export default SearchResults;
