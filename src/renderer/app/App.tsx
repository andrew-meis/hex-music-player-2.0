import Menu from 'components/menu/Menu';
import { redirect } from 'react-router-dom';
import isAppInit from 'scripts/init-app';
import AppController from 'ui/app-controller/AppController';
import AppNavbar from 'ui/app-navigation/AppNavbar';
import AppSurface from 'ui/app-surface/AppSurface';

import IdleTimer from './IdleTimer';
import Modals from './Modals';
import QueueUpdater from './QueueUpdater';
import Toasts from './Toasts';

export const appLoader = async () => {
  const loggedIn = await isAppInit();
  if (!loggedIn) {
    return redirect('/login');
  }
  return null;
};

const App: React.FC = () => {
  return (
    <>
      <IdleTimer />
      <QueueUpdater />
      <AppNavbar />
      <AppSurface />
      <AppController />
      <Modals />
      <Menu />
      <Toasts />
    </>
  );
};

export default App;
