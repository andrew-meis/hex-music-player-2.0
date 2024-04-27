import { Box } from '@mui/material';
import React from 'react';

import Next from './audio-controls/Next';
import PlayPause from './audio-controls/PlayPause';
import Previous from './audio-controls/Previous';
import Seekbar from './audio-controls/Seekbar';

const AudioControl: React.FC = () => {
  return (
    <Box alignItems="center" display="flex" flexBasis="100%">
      <Previous />
      <PlayPause />
      <Next />
      <Seekbar />
    </Box>
  );
};

export default AudioControl;
