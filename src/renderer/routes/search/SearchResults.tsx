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
import Scroller from 'components/virtuoso/Scroller';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import AlbumResult from './result-renderers/AlbumResult';
import ArtistResult from './result-renderers/ArtistResult';
import GenreResult from './result-renderers/GenreResult';
import PlaylistResult from './result-renderers/PlaylistResult';
import TrackResult from './result-renderers/TrackResult';

const Item: React.FC<{
  data: Artist | Album | Track | Playlist | Genre;
}> = ({ data }) => (
  <>
    {isAlbum(data) && <AlbumResult album={data} />}
    {isArtist(data) && <ArtistResult artist={data} />}
    {isGenre(data) && <GenreResult genre={data} />}
    {isPlaylist(data) && <PlaylistResult playlist={data} />}
    {isTrack(data) && <TrackResult track={data} />}
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
