import { useUnmount } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ClickAwayListener, Tab, Typography } from '@mui/material';
import {
  Album,
  Artist,
  Collection,
  Genre,
  isAlbum,
  isArtist,
  isCollection,
  isGenre,
  isPlaylist,
  isTrack,
  Playlist,
  Track,
} from 'api';
import AlbumRow from 'components/album/AlbumRow';
import ArtistRow from 'components/artist/ArtistRow';
import CollectionRow from 'components/collection/CollectionRow';
import GenreRow from 'components/genre/GenreRow';
import PlaylistRow from 'components/playlist/PlaylistRow';
import TrackRow from 'components/track/TrackRow';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import {
  useSearch,
  useSearchAlbums,
  useSearchCollections,
  useSearchGenres,
  useSearchPlaylists,
  useSearchTracks,
} from 'queries';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';

const tabs = [
  {
    filter: 'top',
    label: 'Top Results',
  },
  {
    filter: 'artists',
    label: 'Artists',
  },
  {
    filter: 'albums',
    label: 'Albums',
  },
  {
    filter: 'tracks',
    label: 'Tracks',
  },
  {
    filter: 'playlists',
    label: 'Playlists',
  },
  {
    filter: 'collections',
    label: 'Collections',
  },
  {
    filter: 'genres',
    label: 'Genres',
  },
];

const Item: React.FC<{
  data: Artist | Album | Track | Playlist | Genre | Collection;
  index: number;
}> = ({ data, index }) => (
  <>
    {isAlbum(data) && <AlbumRow album={data} index={index} />}
    {isArtist(data) && <ArtistRow artist={data} index={index} />}
    {isCollection(data) && <CollectionRow collection={data} index={index} />}
    {isGenre(data) && <GenreRow genre={data} index={index} />}
    {isPlaylist(data) && <PlaylistRow index={index} playlist={data} />}
    {isTrack(data) && <TrackRow index={index} options={{ showType: true }} track={data} />}
  </>
);

const ResultsLists: React.FC<{
  results: (Artist | Album | Track | Playlist | Genre | Collection)[] | undefined;
}> = ({ results }) => {
  useUnmount(() => selectActions.handleClickAway());

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  if (!results) return null;

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        if (store.ui.select.items.peek() === results) {
          selectActions.handleClickAway(event);
        }
      }}
    >
      <Virtuoso
        components={{
          Scroller,
        }}
        data={results}
        isScrolling={handleScrollState}
        itemContent={(index, data) => <Item data={data} index={index} />}
        style={{
          height: 'calc(100% - 16px)',
          marginTop: 16,
          width: '100%',
        }}
        onMouseOver={() => store.ui.select.items.set(results)}
      />
    </ClickAwayListener>
  );
};

const SearchResults: React.FC<{
  query: string;
  filter: string;
}> = ({ query, filter }) => {
  const { data: searchResults } = useSearch(query, 100);

  const { data: albumResults } = useSearchAlbums(
    query,
    200,
    query.length > 1 && filter === 'albums'
  );

  const { data: collectionResults } = useSearchCollections(
    query,
    200,
    query.length > 1 && filter === 'collections'
  );

  const { data: genreResults } = useSearchGenres(query, query.length > 1 && filter === 'genres');

  const { data: playlistResults } = useSearchPlaylists(
    query,
    200,
    query.length > 1 && filter === 'playlists'
  );

  const { data: trackResults } = useSearchTracks(
    query,
    200,
    query.length > 1 && filter === 'tracks'
  );

  const navigate = useNavigate();

  return (
    <TabContext value={filter}>
      <TabList>
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={
              <Typography paddingTop={0.25} variant="subtitle1">
                {tab.label}
              </Typography>
            }
            value={tab.filter}
            onAnimationEnd={() => store.ui.search.tabIsAnimating.set(false)}
            onAnimationStart={() => store.ui.search.tabIsAnimating.set(true)}
            onClick={() =>
              navigate({
                pathname: '/search',
                search: createSearchParams({ query, filter: tab.filter }).toString(),
              })
            }
          />
        ))}
      </TabList>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="top">
        <ResultsLists results={searchResults?.slice(0, 10)} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="artists">
        <ResultsLists results={searchResults?.filter((value) => isArtist(value))} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="albums">
        <ResultsLists results={albumResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="tracks">
        <ResultsLists results={trackResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="playlists">
        <ResultsLists results={playlistResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="collections">
        <ResultsLists results={collectionResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="genres">
        <ResultsLists results={genreResults} />
      </TabPanel>
    </TabContext>
  );
};

export default SearchResults;
