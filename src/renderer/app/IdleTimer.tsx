import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { store } from 'state';

const IdleTimer: React.FC = () => {
  const onPresenceChange = () => {
    store.ui.overlay.set(true);
  };

  useIdleTimer({ onPresenceChange, timeout: 1000 * 10 });

  return null;
};

export default IdleTimer;
