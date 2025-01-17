import Menu from 'components/menu/Menu';
import { redirect } from 'react-router-dom';
import isAppInit from 'scripts/init-app';

import AppLayout from './AppLayout';
import Modals from './Modals';
import QueryUpdaters from './QueryUpdaters';
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
      <QueryUpdaters />
      <AppLayout />
      <Modals />
      <Menu />
      <Toasts />
    </>
  );
};

export default App;
