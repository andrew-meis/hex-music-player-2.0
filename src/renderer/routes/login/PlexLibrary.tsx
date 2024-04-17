import { Box, Button, Typography } from '@mui/joy';
import { Section } from 'api';
import { motion } from 'framer-motion';
import React from 'react';

const PlexLibrary: React.FC<{
  sections: Section[];
  setSelectedLibrary: React.Dispatch<React.SetStateAction<number | undefined>>;
}> = ({ sections, setSelectedLibrary }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Typography level="h3">Music Library</Typography>
      <Box alignItems="center" display="flex" flexDirection="column" gap={1} mt={2}>
        {sections.map((section) => (
          <Button
            key={section.uuid}
            sx={{
              borderRadius: 16,
              width: 256,
            }}
            variant="soft"
            onClick={() => setSelectedLibrary(section.id)}
          >
            {section.title}
          </Button>
        ))}
      </Box>
    </motion.div>
  );
};

export default PlexLibrary;
