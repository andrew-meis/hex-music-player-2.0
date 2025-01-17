import React from 'react';

import ChartsDrawer from './ChartsDrawer';
import PlaylistsDrawer from './PlaylistsDrawer';
import QueueDrawer from './QueueDrawer';

const Drawers: React.FC = () => {
  return (
    <>
      <PlaylistsDrawer />
      <ChartsDrawer />
      <QueueDrawer />
    </>
  );
};

export default Drawers;
