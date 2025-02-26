import { useUnmount } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ClickAwayListener, Tab, Typography } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Album, Artist, Collection, Genre, isArtist, Playlist, Track } from 'api';
import { searchColumns } from 'components/search/columns';
import SearchRow from 'components/search/SearchRow';
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
import React, { useMemo } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { allSelectObservables, store } from 'state';
import { DragTypes, SelectObservables } from 'typescript';

export type Result = Artist | Album | Track | Playlist | Genre | Collection;

const tabs = [
  {
    tab: 'top-results',
    label: 'Top Results',
  },
  {
    tab: 'artists',
    label: 'Artists',
  },
  {
    tab: 'albums',
    label: 'Albums',
  },
  {
    tab: 'tracks',
    label: 'Tracks',
  },
  {
    tab: 'playlists',
    label: 'Playlists',
  },
  {
    tab: 'collections',
    label: 'Collections',
  },
  {
    tab: 'genres',
    label: 'Genres',
  },
];

interface TypeMap {
  [key: string]: DragTypes;
}

const typeMap: TypeMap = {
  album: DragTypes.ALBUM,
  artist: DragTypes.ARTIST,
  collection: DragTypes.COLLECTION,
  genre: DragTypes.GENRE,
  playlist: DragTypes.PLAYLIST,
  track: DragTypes.TRACK,
};

const Table: React.FC<{
  results: Result[] | undefined;
}> = ({ results }) => {
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_SEARCH];

  useUnmount(() => selectActions.handleClickAway(selectObservable));
  const columns = useMemo(() => searchColumns, []);
  const table = useReactTable({
    data: results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

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
      onClickAway={(event) => selectActions.handleClickAway(selectObservable, event)}
    >
      <TableVirtuoso
        components={{
          Scroller,
          Table: ({ style, ...props }: TableProps) => (
            <table
              {...props}
              style={{
                ...style,
                width: '-webkit-fill-available',
                tableLayout: 'fixed',
              }}
            />
          ),
          TableRow: (props: ItemProps<Result>) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <SearchRow
                index={index}
                state={selectObservable}
                type={typeMap[row.original._type]}
                {...props}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </SearchRow>
            );
          },
        }}
        isScrolling={handleScrollState}
        style={{ height: 'calc(100% - 8px)', marginTop: 8 }}
        totalCount={rows.length}
        onMouseOver={() => {
          store.ui.menus.activeMenu.set(SelectObservables.ROUTE_SEARCH);
          selectObservable.items.set(results);
        }}
      />
    </ClickAwayListener>
  );
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'top-results';
  const query = searchParams.get('query') || '';
  const isQuery = query.length > 1;

  const { data: searchResults } = useSearch(query, 100);

  const { data: albumResults } = useSearchAlbums(query, 200, isQuery && tab === 'albums');
  // eslint-disable-next-line prettier/prettier
  const { data: collectionResults } = useSearchCollections(query, 200, isQuery && tab === 'collections');

  const { data: genreResults } = useSearchGenres(query, isQuery && tab === 'genres');

  const { data: playlistResults } = useSearchPlaylists(query, 200, isQuery && tab === 'playlists');

  const { data: trackResults } = useSearchTracks(query, 200, isQuery && tab === 'tracks');

  const navigate = useNavigate();

  return (
    <TabContext value={tab}>
      <TabList>
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={
              <Typography paddingTop={0.25} variant="subtitle1">
                {tab.label}
              </Typography>
            }
            value={tab.tab}
            onClick={() =>
              navigate({
                pathname: '/search',
                search: createSearchParams({ query, tab: tab.tab }).toString(),
              })
            }
          />
        ))}
      </TabList>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="top-results">
        <Table results={searchResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="artists">
        <Table results={searchResults?.filter((value) => isArtist(value))} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="albums">
        <Table results={albumResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="tracks">
        <Table results={trackResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="playlists">
        <Table results={playlistResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="collections">
        <Table results={collectionResults} />
      </TabPanel>
      <TabPanel sx={{ height: 1, padding: 0, width: 1 }} value="genres">
        <Table results={genreResults} />
      </TabPanel>
    </TabContext>
  );
};

export default SearchResults;
