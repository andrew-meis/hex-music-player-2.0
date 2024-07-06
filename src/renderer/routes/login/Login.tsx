import { Box, Fade, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Account, Client, Device, Library, ServerConnection } from 'api';
import { AnimatePresence, motion } from 'framer-motion';
import ky from 'ky';
import React, { useEffect, useState } from 'react';
import { redirect, useLoaderData } from 'react-router-dom';
import isAppInit from 'scripts/init-app';
import { PinResponse } from 'src/api/client';

import LoginSettings from './LoginSettings';
import PlexLibrary from './PlexLibrary';
import PlexLogin from './PlexLogin';
import PlexServer from './PlexServer';

const appInfo = await window.api.getAppInfo();
const serverConfig = await window.api.getServerConfig();

const client = new Client({
  identifier: serverConfig?.clientId,
  product: appInfo.appName,
  version: appInfo.appVersion,
  device: appInfo.platform,
  deviceName: appInfo.hostname,
  platform: appInfo.platform,
  platformVersion: appInfo.platformVersion,
});

const account = new Account(client);

export const loginLoader = async () => {
  const loggedIn = await isAppInit();
  if (loggedIn) {
    return redirect('/');
  }
  const pin = await client.pin();
  return pin;
};

const Login: React.FC = () => {
  const pin = useLoaderData() as Awaited<ReturnType<typeof loginLoader>> as PinResponse;

  const [activeStep, setActiveStep] = useState(0);
  const [selectedServer, setSelectedServer] = useState<Device | undefined>(undefined);
  const [selectedLibrary, setSelectedLibrary] = useState<number | undefined>(undefined);

  const { data: authToken } = useQuery({
    queryKey: ['auth-token'],
    queryFn: async () => {
      const response = (await ky(`https://plex.tv/api/v2/pins/${pin.id}`, {
        headers: {
          accept: 'application/json',
          ...client.headers(),
        },
        searchParams: {
          code: pin.code,
          'X-Plex-Client-Identifier': client.identifier,
        },
      }).json()) as Record<string, any>;
      return response.authToken;
    },
    enabled: activeStep === 1,
    refetchInterval: ({ state: { data } }) => {
      if (!data) {
        return 2000;
      }
      return false;
    },
  });

  const { data: servers } = useQuery({
    queryKey: ['servers'],
    queryFn: () => {
      account.authToken = authToken;
      return account.servers();
    },
    enabled: !!authToken,
  });

  useEffect(() => {
    if (servers) {
      setActiveStep(2);
    }
  }, [servers]);

  const { data: serverConnection } = useQuery({
    queryKey: ['server-connection', selectedServer?.name],
    queryFn: async () => {
      const promises = selectedServer!.connections.map((_connection, index) => {
        const { uri } = selectedServer!.connections[index];
        return ky(`${uri}/servers?X-Plex-Token=${selectedServer!.accessToken}`, {
          timeout: 10000,
        });
      });
      const response = await Promise.race(promises);
      return selectedServer!.connections.find(
        (conn) => conn.uri === response.url.split('/servers')[0]
      )!;
    },
    enabled: !!selectedServer,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: librarySections } = useQuery({
    queryKey: ['library-sections'],
    queryFn: async () => {
      if (!selectedServer) return;
      const newConnection = new ServerConnection(serverConnection!.uri, account);
      const library = new Library(newConnection, selectedServer);
      const sectionContainer = await library.sections();
      return sectionContainer.sections.filter((section) => section.type === 'artist');
    },
    enabled: !!serverConnection,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (librarySections) {
      setActiveStep(3);
    }
  }, [librarySections]);

  useEffect(() => {
    if (!selectedLibrary) return;
    const newServerConfig = {
      authToken: account.authToken,
      clientId: client.identifier,
      sectionId: selectedLibrary!,
      serverName: selectedServer!.name,
    };
    window.api.setServerConfig(newServerConfig);
    setActiveStep(4);
  }, [selectedLibrary]);

  return (
    <Box alignItems="center" display="flex" height="calc(100% - 30px)" width={1}>
      <Fade in={!!pin.code}>
        <Box
          borderRadius={4}
          component={Paper}
          display="flex"
          elevation={1}
          flexDirection="column"
          height={350}
          margin="auto"
          padding={2}
          position="relative"
          sx={{
            textAlign: 'center',
          }}
          width={300}
        >
          <AnimatePresence initial={false} mode="wait">
            {(activeStep === 0 || activeStep === 1) && (
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="login"
              >
                <PlexLogin
                  activeStep={activeStep}
                  client={client}
                  code={pin.code}
                  key={activeStep}
                  setActiveStep={setActiveStep}
                />
              </motion.div>
            )}
            {activeStep === 2 && servers && (
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="server"
              >
                <PlexServer
                  key={activeStep}
                  servers={servers}
                  setSelectedServer={setSelectedServer}
                />
              </motion.div>
            )}
            {activeStep === 3 && librarySections && (
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="library"
              >
                <PlexLibrary sections={librarySections} setSelectedLibrary={setSelectedLibrary} />
              </motion.div>
            )}
            {activeStep === 4 && (
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="settings"
              >
                <LoginSettings />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Fade>
    </Box>
  );
};

export default Login;
