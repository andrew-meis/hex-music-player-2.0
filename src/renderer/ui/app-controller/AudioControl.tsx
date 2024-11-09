import { Box } from '@mui/material';
import React from 'react';

import Next from './audio-controls/Next';
import PlayPause from './audio-controls/PlayPause';
import Previous from './audio-controls/Previous';
import Repeat from './audio-controls/Repeat';
import Shuffle from './audio-controls/Shuffle';

const AudioControl: React.FC = () => {
  return (
    <Box alignItems="center" display="flex">
      <Shuffle />
      <Previous />
      <PlayPause />
      <Next />
      <Repeat />
    </Box>
  );
};

export default AudioControl;
