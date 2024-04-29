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
import Artist, { artistLoader } from 'routes/artist/Artist';
import ArtistDiscography, {
  artistDiscographyLoader,
} from 'routes/artist/subroutes/discography/ArtistDiscography';
import Artists, { artistsLoader } from 'routes/artists/Artists';
import Charts from 'routes/charts/Charts';
import Genre, { genreLoader } from 'routes/genre/Genre';
import Library, { libraryLoader } from 'routes/library/Library';
import Login, { loginLoader } from 'routes/login/Login';
import Playlist, { playlistLoader } from 'routes/playlist/Playlist';
import Queue from 'routes/queue/Queue';
import Search, { searchLoader } from 'routes/search/Search';
import Settings, { settingsLoader } from 'routes/settings/Settings';
import Track, { trackLoader } from 'routes/track/Track';
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
        path: '/album/:id',
        element: <Album />,
        loader: albumLoader,
      },
      {
        path: '/artists',
        element: <Artists />,
        loader: artistsLoader,
      },
      {
        path: '/artist/:id',
        element: <Artist />,
        loader: artistLoader,
      },
      {
        path: '/artist/:id/discography',
        element: <ArtistDiscography />,
        loader: artistDiscographyLoader,
      },
      {
        path: '/charts',
        element: <Charts />,
      },
      {
        path: '/genre/:id',
        element: <Genre />,
        loader: genreLoader,
      },
      {
        path: '/playlist/:id',
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
        path: '/track/:id',
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
      <ReactQueryDevtools buttonPosition="top-left" initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
