import { Button, Typography } from '@mui/joy';
import { Client } from 'api';
import { motion } from 'framer-motion';
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Typography level="h3">Login</Typography>
      <Button
        component="a"
        href={createAuthUrl(client, code)}
        endDecorator={
          <FiExternalLink style={{ height: '0.9em', width: '0.9em' }} viewBox="0 1 24 24" />
        }
        loading={activeStep === 1}
        rel="noreferrer"
        size="lg"
        sx={{
          borderRadius: 16,
          mt: 2,
          width: 256,
        }}
        target="_blank"
        variant="soft"
        onClick={() => setActiveStep(1)}
      >
        Authenticate with Plex
      </Button>
    </motion.div>
  );
};

export default PlexLogin;
