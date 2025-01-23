import { reactive } from '@legendapp/state/react';
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
import Scroller from 'components/scroller/Scroller';
import { useImageResize } from 'hooks/useImageResize';
import { useUser } from 'queries';
import React, { useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { TbExternalLink } from 'react-icons/tb';
import RouteContainer from 'routes/RouteContainer';
import RouteHeader from 'routes/RouteHeader';
import { persistedStore, store } from 'state';

const ReactiveTextField = reactive(TextField);

const settingsBoxStyle = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
};

const Settings: React.FC = () => {
  const { data: user } = useUser();
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

  const thumbSrc = useImageResize(
    new URLSearchParams({
      url: user?.thumb || '',
      width: '80',
      height: '80',
    })
  );

  const handleLogout = async () => {
    const savedConfig = await window.api.getValue('server-config');
    await window.api.setValue('server-config', {
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
            src={thumbSrc}
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
