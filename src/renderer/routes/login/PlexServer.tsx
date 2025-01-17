import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { Device } from 'api';
import React, { useState } from 'react';

const PlexServer: React.FC<{
  servers: {
    devices: Device[];
    _type: string;
  };
  setSelectedServer: React.Dispatch<React.SetStateAction<Device | undefined>>;
}> = ({ servers, setSelectedServer }) => {
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <Typography variant="h4">Server Name</Typography>
      <Box alignItems="center" display="flex" flexDirection="column" gap={1} mt={2}>
        {servers.devices.map((device) => (
          <LoadingButton
            key={device.id}
            loading={isLoading}
            sx={{
              borderRadius: 16,
              maxWidth: 192,
            }}
            variant="outlined"
            onClick={() => {
              setLoading(true);
              setSelectedServer(device);
            }}
          >
            {device.name}
          </LoadingButton>
        ))}
      </Box>
    </>
  );
};

export default PlexServer;
