import Menu from 'components/menu/Menu';
import { redirect } from 'react-router-dom';
import isAppInit from 'scripts/init-app';
import AppController from 'ui/app-controller/AppController';
import AppNavigation from 'ui/app-navigation/AppNavigation';
import AppSurface from 'ui/app-surface/AppSurface';

import Modals from './Modals';
import QueueUpdater from './QueueUpdater';

export const appLoader = async () => {
  const loggedIn = await isAppInit();
  if (!loggedIn) {
    return redirect('/login');
  }
  return null;
};

const App: React.FC = () => (
  <>
    <QueueUpdater />
    <AppNavigation />
    <AppSurface />
    <AppController />
    <Modals />
    <Menu />
  </>
);

export default App;
