import 'assets/main.css';
import 'overlayscrollbars/overlayscrollbars.css';

import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App, { appLoader } from 'app/App';
import ErrorElement from 'main/ErrorElement';
import MuiThemeProvider from 'main/MuiThemeProvider';
import WindowThemeModeSwitch from 'main/WindowThemeModeSwitch';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Album, { albumLoader } from 'routes/album/Album';
import Albums, { albumsLoader } from 'routes/albums/Albums';
import Artist, { artistLoader } from 'routes/artist/Artist';
import ArtistDiscography, {
  artistDiscographyLoader,
} from 'routes/artist/subroutes/discography/ArtistDiscography';
import Artists, { artistsLoader } from 'routes/artists/Artists';
import Charts from 'routes/charts/Charts';
import Collection, { collectionLoader } from 'routes/collection/Collection';
import Collections, { collectionsLoader } from 'routes/collections/Collections';
import Genre, { genreLoader } from 'routes/genre/Genre';
import Genres, { genresLoader } from 'routes/genres/Genres';
import Library, { libraryLoader } from 'routes/library/Library';
import Login, { loginLoader } from 'routes/login/Login';
import Playlist, { playlistLoader } from 'routes/playlist/Playlist';
import Playlists, { playlistsLoader } from 'routes/playlists/Playlists';
import Queue from 'routes/queue/Queue';
import Search, { searchLoader } from 'routes/search/Search';
import Settings, { settingsLoader } from 'routes/settings/Settings';
import Track, { trackLoader } from 'routes/track/Track';
import Tracks, { tracksLoader } from 'routes/tracks/Tracks';
import Titlebar from 'ui/titlebar/Titlebar';

enableReactComponents();

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorElement />,
    loader: appLoader,
    children: [
      {
        path: '/',
        element: <Library />,
        loader: libraryLoader(queryClient),
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
        path: '/queue',
        element: <Queue />,
      },
      {
        path: '/search',
        element: <Search />,
        loader: searchLoader,
      },
      {
        path: '/settings',
        element: <Settings />,
        loader: settingsLoader(queryClient),
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
        <WindowThemeModeSwitch />
        <Box bgcolor="background.default" height="100vh" position="absolute" width="100vw">
          <Titlebar />
          <RouterProvider router={router} />
        </Box>
      </MuiThemeProvider>
      <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
