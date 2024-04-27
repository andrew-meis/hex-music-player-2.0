import { Box, Button, Typography } from '@mui/material';
import { Section } from 'api';
import React from 'react';

const PlexLibrary: React.FC<{
  sections: Section[];
  setSelectedLibrary: React.Dispatch<React.SetStateAction<number | undefined>>;
}> = ({ sections, setSelectedLibrary }) => {
  return (
    <>
      <Typography variant="h3">Music Library</Typography>
      <Box alignItems="center" display="flex" flexDirection="column" gap={1} mt={2}>
        {sections.map((section) => (
          <Button
            key={section.uuid}
            sx={{
              borderRadius: 16,
              maxWidth: 192,
            }}
            variant="outlined"
            onClick={() => setSelectedLibrary(section.id)}
          >
            {section.title}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default PlexLibrary;
