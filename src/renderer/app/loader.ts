import { redirect } from 'react-router-dom';
import isAppInit from 'scripts/init-app';

export const appLoader = async () => {
  const loggedIn = await isAppInit();
  if (!loggedIn) {
    return redirect('/login');
  }
  return null;
};
