import { Box, Button, Typography } from '@mui/joy';
import { Device } from 'api';
import { motion } from 'framer-motion';
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Typography level="h3">Server Name</Typography>
      <Box alignItems="center" display="flex" flexDirection="column" gap={1} mt={2}>
        {servers.devices.map((device) => (
          <Button
            key={device.id}
            loading={isLoading}
            sx={{
              borderRadius: 16,
              width: 256,
            }}
            variant="soft"
            onClick={() => {
              setLoading(true);
              setSelectedServer(device);
            }}
          >
            {device.name}
          </Button>
        ))}
      </Box>
    </motion.div>
  );
};

export default PlexServer;
