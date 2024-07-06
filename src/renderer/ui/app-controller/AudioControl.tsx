import { Box } from '@mui/material';
import React from 'react';

import Next from './audio-controls/Next';
import PlayPause from './audio-controls/PlayPause';
import Previous from './audio-controls/Previous';

const AudioControl: React.FC = () => {
  return (
    <Box alignItems="center" display="flex">
      <Previous />
      <PlayPause />
      <Next />
    </Box>
  );
};

export default AudioControl;
