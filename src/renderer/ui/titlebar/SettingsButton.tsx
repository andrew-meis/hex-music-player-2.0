import { IconButton } from '@mui/material';
import React from 'react';
import { MdSettings } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const SettingsButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => navigate('/settings');

  return (
    <IconButton
      className={location.pathname === '/settings' ? 'selected' : ''}
      onClick={handleClick}
    >
      <MdSettings />
    </IconButton>
  );
};

export default SettingsButton;
