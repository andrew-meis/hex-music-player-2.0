import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import { Client } from 'api';
import qs from 'qs';
import React from 'react';
import { FiExternalLink } from 'react-icons/fi';

const createAuthUrl = (client: Client, code: string): string => {
  const authAppUrl = qs.stringify({
    clientID: client.identifier,
    code,
    context: {
      device: {
        device: client.device,
        deviceName: client.deviceName,
        product: client.product,
        version: client.version,
      },
    },
  });
  return `https://app.plex.tv/auth#?${authAppUrl}`;
};

const PlexLogin: React.FC<{
  activeStep: number;
  client: Client;
  code: string;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ activeStep, client, code, setActiveStep }) => {
  return (
    <>
      <Typography variant="h3">Login</Typography>
      <LoadingButton
        endIcon={<FiExternalLink style={{ height: '0.9em', width: '0.9em' }} viewBox="0 0 24 24" />}
        href={createAuthUrl(client, code)}
        loading={activeStep === 1}
        loadingPosition="end"
        rel="noreferrer"
        size="large"
        sx={{
          borderRadius: 16,
          mt: 2,
          width: 284,
        }}
        target="_blank"
        variant="contained"
        onClick={() => setActiveStep(1)}
      >
        Authenticate with Plex
      </LoadingButton>
    </>
  );
};

export default PlexLogin;
