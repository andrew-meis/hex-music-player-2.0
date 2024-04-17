import { useSelector } from '@legendapp/state/react';
import { Avatar, Box, IconButton, SvgIcon, Switch, Typography, useColorScheme } from '@mui/joy';
import { QueryClient } from '@tanstack/react-query';
import { User } from 'api';
import isAppInit from 'app/init-app';
import { userQuery } from 'queries';
import React, { useRef } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { store } from 'state';

const settingsBoxStyle = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
};

interface loaderReturn {
  user: User;
}

export const settingsLoader = (queryClient: QueryClient) => async (): Promise<loaderReturn> => {
  await isAppInit();
  const account = store.account.get();
  const userDataQuery = userQuery(account);
  return {
    user:
      queryClient.getQueryData(userDataQuery.queryKey) ??
      (await queryClient.fetchQuery(userDataQuery)),
  };
};

const Settings: React.FC = () => {
  const { user } = useLoaderData() as Awaited<loaderReturn>;

  const thumb = useRef<string | undefined>();
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();

  const thumbSrc = useSelector(() => {
    const library = store.library.get();
    if (!library) {
      return undefined;
    }
    const newThumb = library.resizeImage({ url: user.thumb, width: 80, height: 80 });
    thumb.current = newThumb;
    return newThumb;
  });

  const handleLogout = async () => {
    const savedConfig = await window.api.getServerConfig();
    await window.api.setServerConfig({
      ...savedConfig,
      authToken: '',
    });
    store.account.set(undefined);
    store.library.set(undefined);
    navigate('/login');
  };

  return (
    <Box marginX={4}>
      <Typography paddingY={2} level="h1">
        Settings
      </Typography>
      <Typography level="h4">Plex Account</Typography>
      <Box alignItems="center" display="flex" paddingY={1} width={1}>
        <Avatar
          alt={user?.title}
          src={thumbSrc || thumb.current}
          sx={{
            height: 64,
            width: 64,
            marginRight: 1,
          }}
        />
        <Box>
          <Typography fontFamily="Rubik" fontWeight={600}>
            {user?.title}
          </Typography>
          <Typography>{user?.username}</Typography>
        </Box>
        <IconButton sx={{ marginLeft: 'auto' }} onClick={handleLogout}>
          <SvgIcon>
            <FiLogOut />
          </SvgIcon>
        </IconButton>
      </Box>
      <Typography paddingTop={2} level="h4">
        App Interface
      </Typography>
      <Box sx={settingsBoxStyle}>
        <Typography sx={{ fontWeight: 600 }} level="body-md">
          Dark Mode
        </Typography>
        <Switch
          checked={mode === 'dark'}
          size="lg"
          onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
        />
      </Box>
    </Box>
  );
};

export default Settings;
