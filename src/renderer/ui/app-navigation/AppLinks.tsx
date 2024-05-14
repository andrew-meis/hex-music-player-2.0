import { Box, IconButton } from '@mui/material';
import React from 'react';
import { BsViewList } from 'react-icons/bs';
import { CgSearch } from 'react-icons/cg';
import { TiChartLine } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

type Buttons = 'search' | 'charts' | 'queue';

const AppLinks: React.FC<{
  locations: React.MutableRefObject<{
    charts: string;
    library: string;
    queue: string;
    search: string;
    settings: string;
  }>;
}> = ({ locations }) => {
  const navigate = useNavigate();

  const handleButtonClick = (buttonClicked: Buttons) => {
    switch (buttonClicked) {
      case 'search':
        if (location.pathname === '/search') return;
        navigate(locations.current.search);
        break;
      case 'charts':
        if (location.pathname === '/charts') return;
        navigate(locations.current.charts);
        break;
      case 'queue':
        if (location.pathname === '/queue') return;
        navigate(locations.current.queue);
        break;
      default:
        break;
    }
  };

  return (
    <Box display="flex" justifySelf="end">
      <IconButton
        className={location.pathname === '/search' ? 'selected' : ''}
        onClick={() => handleButtonClick('search')}
      >
        <CgSearch viewBox="1 -1 25 24" />
      </IconButton>
      <IconButton
        className={location.pathname === '/charts' ? 'selected' : ''}
        onClick={() => handleButtonClick('charts')}
      >
        <TiChartLine />
      </IconButton>
      <IconButton
        className={location.pathname === '/queue' ? 'selected' : ''}
        sx={{ fontSize: '1.375rem', height: 36, width: 36 }}
        onClick={() => handleButtonClick('queue')}
      >
        <BsViewList viewBox="0 3 16 16" />
        <BsViewList style={{ position: 'absolute' }} viewBox="0 -12 16 16" />
      </IconButton>
    </Box>
  );
};

export default AppLinks;
