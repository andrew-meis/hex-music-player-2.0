import { reactive, useSelector } from '@legendapp/state/react';
import {
  Avatar,
  Box,
  IconButton,
  Input,
  SvgIcon,
  Switch,
  Typography,
  useColorScheme,
} from '@mui/joy';
import { QueryClient } from '@tanstack/react-query';
import { User } from 'api';
import isAppInit from 'app/init-app';
import Scroller from 'components/scroller/Scroller';
import { userQuery } from 'queries';
import React, { useRef } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { TbExternalLink } from 'react-icons/tb';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { persistedStore, store } from 'state';

const ReactiveInput = reactive(Input);

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
    <Box display="flex" flexDirection="column" height={1} marginX={4}>
      <Typography level="h1" paddingY={2}>
        Settings
      </Typography>
      <Scroller style={{ height: '-webkit-fill-available', marginBottom: 16, paddingRight: 16 }}>
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
        <Typography level="h4" paddingTop={2}>
          App Interface
        </Typography>
        <Box sx={settingsBoxStyle}>
          <Typography level="body-md" sx={{ fontWeight: 600 }}>
            Dark Mode
          </Typography>
          <Switch
            checked={mode === 'dark'}
            size="lg"
            onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
        </Box>
        <Typography level="h4" paddingTop={2}>
          last.fm
        </Typography>
        <Box sx={settingsBoxStyle}>
          <Typography level="body-md" sx={{ fontWeight: 600 }}>
            API Key
          </Typography>
          <ReactiveInput
            $defaultValue={persistedStore.lastfmApiKey}
            sx={{
              '--Input-minHeight': '2rem',
              '--Input-paddingInline': '0.5rem',
              background: 'transparent',
              width: 312,
              '&:hover': {
                background: `rgba(21, 21, 21, ${mode === 'dark' ? '1' : '0.08'})`,
              },
            }}
            variant="outlined"
            onChange={(event) => persistedStore.lastfmApiKey.set(event.currentTarget.value)}
          />
        </Box>
        <Typography level="body-sm" marginTop={-0.5}>
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
    </Box>
  );
};

export default Settings;
