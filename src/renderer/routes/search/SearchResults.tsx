import { useUnmount } from '@legendapp/state/react';
import { ClickAwayListener } from '@mui/material';
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
import { store } from 'state';
import { selectActions } from 'ui/select';

const Item: React.FC<{
  data: Artist | Album | Track | Playlist | Genre;
  index: number;
}> = ({ data, index }) => (
  <>
    {isAlbum(data) && <AlbumRow album={data} index={index} />}
    {isArtist(data) && <ArtistRow artist={data} index={index} />}
    {isGenre(data) && <GenreRow genre={data} index={index} />}
    {isPlaylist(data) && <PlaylistRow index={index} playlist={data} />}
    {isTrack(data) && <TrackRow index={index} options={{ showType: true }} track={data} />}
  </>
);

const SearchResults: React.FC<{
  searchResults: (Artist | Album | Track | Playlist | Genre)[];
}> = ({ searchResults }) => {
  useUnmount(() => selectActions.handleClickAway());

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        if (store.ui.select.items.peek() === searchResults) {
          selectActions.handleClickAway(event);
        }
      }}
    >
      <Virtuoso
        components={{
          Scroller,
        }}
        data={searchResults}
        isScrolling={handleScrollState}
        itemContent={(index, data) => <Item data={data} index={index} />}
        style={{ height: '100%', marginBottom: 16, marginTop: 16 }}
        onMouseEnter={() => store.ui.select.items.set(searchResults)}
      />
    </ClickAwayListener>
  );
};

export default SearchResults;
