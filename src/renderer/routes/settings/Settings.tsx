import { reactive, useSelector } from '@legendapp/state/react';
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  SvgIcon,
  Switch,
  TextField,
  Typography,
  useColorScheme,
} from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import { User } from 'api';
import Scroller from 'components/scroller/Scroller';
import { userQuery } from 'queries';
import React, { useEffect, useRef } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { TbExternalLink } from 'react-icons/tb';
import { useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import RouteHeader from 'routes/RouteHeader';
import isAppInit from 'scripts/init-app';
import { persistedStore, store } from 'state';

const ReactiveTextField = reactive(TextField);

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
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Settings',
        to: { pathname: '/settings' },
      },
    ]);
  }, []);

  const thumbSrc = useSelector(() => {
    const library = store.library.get();
    if (!library) {
      return undefined;
    }
    const newThumb = library.resizeImage(
      new URLSearchParams({ url: user.thumb, width: '80', height: '80' })
    );
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
  };

  return (
    <RouteContainer>
      <Scroller style={{ height: '-webkit-fill-available', paddingRight: 16 }}>
        <RouteHeader title="Settings" />
        <Typography variant="h4">Plex Account</Typography>
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
        <Typography paddingTop={2} variant="h4">
          App Interface
        </Typography>
        <Box sx={settingsBoxStyle}>
          <Typography sx={{ fontWeight: 600 }} variant="body1">
            Dark Mode
          </Typography>
          <Switch
            checked={mode === 'dark'}
            onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
        </Box>
        <Typography paddingTop={2} variant="h4">
          last.fm
        </Typography>
        <Box sx={settingsBoxStyle}>
          <Typography sx={{ fontWeight: 600 }} variant="body1">
            API Key
          </Typography>
          <ReactiveTextField
            $defaultValue={persistedStore.lastfmApiKey}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <ImLastfm />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 344,
            }}
            variant="standard"
            onChange={(event) => persistedStore.lastfmApiKey.set(event.currentTarget.value)}
          />
        </Box>
        <Typography marginTop={-0.5} variant="subtitle2">
          {'Paste your '}
          <a
            href="https://www.last.fm/api/authentication"
            rel="noreferrer"
            style={{
              color: 'inherit',
            }}
            target="_blank"
          >
            last.fm API key
          </a>
          &nbsp;
          <TbExternalLink viewBox="0 -1 22 22" />
        </Typography>
      </Scroller>
    </RouteContainer>
  );
};

export default Settings;
