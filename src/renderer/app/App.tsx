import { Box, Divider } from '@mui/material';
import { audio } from 'audio';
import Menu from 'components/menu/Menu';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { store } from 'state';
import AppController from 'ui/app-controller/AppController';
import Drawers from 'ui/app-drawers/Drawers';
import NavigationBreadcrumbs from 'ui/app-titlebar/NavigationBreadcrumbs';
import NavigationButtons from 'ui/app-titlebar/NavigationButtons';
import SearchInput from 'ui/app-titlebar/SearchInput';

import Modals from './Modals';
import QueryUpdaters from './QueryUpdaters';
import Toasts from './Toasts';

// const WebSocket: React.FC = observer(function () {
//   const address = store.library.server.connection.address.get();
//   const port = store.library.server.connection.port.get();
//   const token = store.account.authToken.get();

//   const { lastJsonMessage } = useWebSocket(
//     `ws://${address}:${port}/:/websockets/notifications?X-Plex-Token=${token}`,
//     {
//       filter: (message) => {
//         const data = JSON.parse(message.data);
//         const { NotificationContainer } = data;
//         return !['playing'].includes(NotificationContainer.type);
//       },
//     }
//   );

//   console.log(lastJsonMessage);

//   return null;
// });

window.addEventListener('keydown', function (e) {
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault();
    const nowPlaying = store.queue.nowPlaying.get();
    if (!nowPlaying) return;
    const isPlaying = store.audio.isPlaying.get();
    if (isPlaying) {
      audio.pause();
      return;
    }
    audio.play();
  }
});

const Layout: React.FC = () => {
  return (
    <Box margin="auto" maxWidth={1920} width={1}>
      <Drawers />
      <Box
        alignItems="center"
        display="flex"
        height={56}
        justifyContent="space-between"
        paddingX={1}
        width="-webkit-fill-available"
      >
        <NavigationButtons />
        <NavigationBreadcrumbs />
        <SearchInput />
      </Box>
      <Divider sx={{ marginX: 1 }} />
      <Box
        color="text.primary"
        height="var(--content-height)"
        margin={1}
        maxWidth={1904}
        minHeight="var(--content-height)"
        position="relative"
        width="calc(100vw - 16px)"
        zIndex={0}
      >
        <Outlet />
      </Box>
      <Divider sx={{ marginX: 1 }} />
      <AppController />
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <>
      <QueryUpdaters />
      <Layout />
      <Modals />
      <Menu />
      <Toasts />
    </>
  );
};

export default App;
