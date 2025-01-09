import { IconButton } from '@mui/material';
import React from 'react';
import { CgSearch } from 'react-icons/cg';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <IconButton
      className={location.pathname === '/search' ? 'selected' : ''}
      sx={{
        pointerEvents: location.pathname === '/search' ? 'none' : '',
      }}
      onClick={() => navigate('/search')}
    >
      <CgSearch viewBox="1 -1 25 24" />
    </IconButton>
  );
};

export default SearchButton;
