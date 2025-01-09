import { Box } from '@mui/material';
import React from 'react';

import Next from './Next';
import PlayPause from './PlayPause';
import Previous from './Previous';
import Repeat from './Repeat';
import Shuffle from './Shuffle';

const AudioControls: React.FC = () => {
  return (
    <Box alignItems="center" display="flex" height={64} marginX={1}>
      <Shuffle />
      <Previous />
      <PlayPause />
      <Next />
      <Repeat />
    </Box>
  );
};

export default AudioControls;
