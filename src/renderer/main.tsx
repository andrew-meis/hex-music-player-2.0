import 'assets/main.css';
import 'overlayscrollbars/overlayscrollbars.css';

import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from 'app/App';
import { appLoader } from 'app/loader';
import { audio } from 'audio';
import DragLayer from 'main/DragLayer';
import ErrorElement from 'main/ErrorElement';
import MuiThemeProvider from 'main/MuiThemeProvider';
import WindowThemeModeSwitch from 'main/WindowThemeModeSwitch';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Album from 'routes/album/Album';
import { albumLoader } from 'routes/album/loader';
import Albums from 'routes/albums/Albums';
import { albumsLoader } from 'routes/albums/loader';
import Artist from 'routes/artist/Artist';
import { artistLoader } from 'routes/artist/loader';
import ArtistDiscography from 'routes/artist/subroutes/discography/ArtistDiscography';
import { artistDiscographyLoader } from 'routes/artist/subroutes/discography/loader';
import Artists from 'routes/artists/Artists';
import { artistsLoader } from 'routes/artists/loader';
import Charts from 'routes/charts/Charts';
import { chartsLoader } from 'routes/charts/loader';
import Collection from 'routes/collection/Collection';
import { collectionLoader } from 'routes/collection/loader';
import Collections from 'routes/collections/Collections';
import { collectionsLoader } from 'routes/collections/loader';
import CurrentFavorites from 'routes/current-favorites/CurrentFavorites';
import Genre from 'routes/genre/Genre';
import { genreLoader } from 'routes/genre/loader';
import Genres from 'routes/genres/Genres';
import { genresLoader } from 'routes/genres/loader';
import Library from 'routes/library/Library';
import { libraryLoader } from 'routes/library/loader';
import Login, { loginLoader } from 'routes/login/Login';
import { nowPlayingLoader } from 'routes/now-playing/loader';
import NowPlaying from 'routes/now-playing/NowPlaying';
import { playlistLoader } from 'routes/playlist/loader';
import Playlist from 'routes/playlist/Playlist';
import { playlistsLoader } from 'routes/playlists/loader';
import Playlists from 'routes/playlists/Playlists';
import { searchLoader } from 'routes/search/loader';
import Search from 'routes/search/Search';
import Settings from 'routes/settings/Settings';
import { trackLoader } from 'routes/track/loader';
import Track from 'routes/track/Track';
import { tracksLoader } from 'routes/tracks/loader';
import Tracks from 'routes/tracks/Tracks';
import { createSelectObservable, persistedStore, store } from 'state';
import { SelectObservables } from 'typescript';
import Titlebar from 'ui/titlebar/Titlebar';

enableReactComponents();

window.addEventListener('pagehide', async () => {
  persistedStore.audio.savedTimeMillis.set(audio.currentTimeMillis);
  window.clearInterval(store.audio.intervalTimer.peek());
  const library = store.library.peek();
  const nowPlaying = store.queue.nowPlaying.peek();
  await library.timeline({
    currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
    duration: nowPlaying.track.duration,
    key: nowPlaying.track.key,
    playerState: 'stopped',
    queueItemId: nowPlaying.id,
    ratingKey: nowPlaying.track.ratingKey,
  });
});

// Instantiate each new select observable here
const keys = Object.keys(SelectObservables).filter((value) => isNaN(Number(value)));
keys.forEach((key) => {
  createSelectObservable(SelectObservables[key]);
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false },
  },
});

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorElement />,
    loader: appLoader,
    children: [
      {
        path: '/',
        element: <Library />,
        loader: libraryLoader,
      },
      {
        path: '/albums',
        element: <Albums />,
        loader: albumsLoader,
      },
      {
        path: '/albums/:id',
        element: <Album />,
        loader: albumLoader,
      },
      {
        path: '/artists',
        element: <Artists />,
        loader: artistsLoader,
      },
      {
        path: '/artists/:id',
        element: <Artist />,
        loader: artistLoader,
      },
      {
        path: '/artists/:id/discography',
        element: <ArtistDiscography />,
        loader: artistDiscographyLoader,
      },
      {
        path: '/charts',
        element: <Charts />,
        loader: chartsLoader,
      },
      {
        path: '/collections',
        element: <Collections />,
        loader: collectionsLoader,
      },
      {
        path: '/collections/:id',
        element: <Collection />,
        loader: collectionLoader,
      },
      {
        path: '/current-favorites',
        element: <CurrentFavorites />,
      },
      {
        path: '/genres',
        element: <Genres />,
        loader: genresLoader,
      },
      {
        path: '/genres/:id',
        element: <Genre />,
        loader: genreLoader,
      },
      {
        path: '/now-playing',
        element: <NowPlaying />,
        loader: nowPlayingLoader,
      },
      {
        path: '/playlists',
        element: <Playlists />,
        loader: playlistsLoader,
      },
      {
        path: '/playlists/:id',
        element: <Playlist />,
        loader: playlistLoader,
      },
      {
        path: '/search',
        element: <Search />,
        loader: searchLoader,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/tracks',
        element: <Tracks />,
        loader: tracksLoader,
      },
      {
        path: '/tracks/:id',
        element: <Track />,
        loader: trackLoader,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    loader: loginLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <WindowThemeModeSwitch />
          <DndProvider backend={HTML5Backend}>
            <Box bgcolor="background.default" height="100vh" position="absolute" width="100vw">
              <DragLayer />
              <Titlebar />
              <RouterProvider router={router} />
            </Box>
          </DndProvider>
        </LocalizationProvider>
      </MuiThemeProvider>
      <ReactQueryDevtools buttonPosition="top-left" initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
