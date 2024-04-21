import { redirect, useLocation } from 'react-router-dom';
import AppController from 'ui/app-controller/AppController';
import AppSurface from 'ui/app-surface/AppSurface';

import isAppInit from './init-app';
import Modals from './Modals';
import QueueUpdater from './QueueUpdater';

export const appLoader = async () => {
  const loggedIn = await isAppInit();
  if (!loggedIn) {
    return redirect('/login');
  }
  return null;
};

const App: React.FC = () => {
  const location = useLocation();

  console.log(location);

  return (
    <>
      <QueueUpdater />
      <AppSurface />
      <AppController />
      <Modals />
    </>
  );
};

export default App;
