import { Box, IconButton } from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';
import { BsViewList } from 'react-icons/bs';
import { CgSearch } from 'react-icons/cg';
import { LuLibrary } from 'react-icons/lu';
import { MdSettings } from 'react-icons/md';
import { TiChartLine } from 'react-icons/ti';
import { useLocation, useNavigate } from 'react-router-dom';

import Volume from './audio-controls/Volume';

type Buttons = 'charts' | 'library' | 'search' | 'settings' | 'queue';

const ROUTES = ['/charts', '/search', '/settings', '/queue'];

const NavLinks: React.FC<{
  isBrowserOpen: boolean;
  setBrowserOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isBrowserOpen, setBrowserOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const locations = useRef({
    charts: '/charts',
    library: '/',
    queue: '/queue',
    search: '/search',
    settings: '/settings',
  });

  const locationString = useMemo(() => `${location.pathname}${location.search}`, [location]);

  useEffect(() => {
    switch (location.pathname) {
      case '/charts':
        locations.current = {
          ...locations.current,
          charts: locationString,
        };
        return;
      case '/queue':
        locations.current = {
          ...locations.current,
          queue: '/queue',
        };
        return;
      case '/search':
        locations.current = {
          ...locations.current,
          search: locationString,
        };
        return;
      case '/settings':
        locations.current = {
          ...locations.current,
          settings: '/settings',
        };
        return;
      default:
        locations.current = {
          ...locations.current,
          library: locationString,
        };
    }
  }, [location, locationString]);

  const handleButtonClick = (buttonClicked: Buttons) => {
    switch (buttonClicked) {
      case 'charts':
        if (isBrowserOpen && location.pathname === '/charts') {
          setBrowserOpen(false);
          return;
        }
        if (!isBrowserOpen && locationString === locations.current.charts) {
          setBrowserOpen(true);
          return;
        }
        navigate(locations.current.charts);
        break;
      case 'library':
        if (isBrowserOpen && location.pathname === '/') {
          setBrowserOpen(false);
          return;
        }
        if (isBrowserOpen && !ROUTES.includes(location.pathname) && location.pathname !== '/') {
          navigate('/');
          return;
        }
        if (!isBrowserOpen && locationString === locations.current.library) {
          setBrowserOpen(true);
          return;
        }
        navigate(locations.current.library);
        break;
      case 'queue':
        if (isBrowserOpen && location.pathname === '/queue') {
          setBrowserOpen(false);
          return;
        }
        if (!isBrowserOpen && locationString === locations.current.queue) {
          setBrowserOpen(true);
          return;
        }
        navigate(locations.current.queue);
        break;
      case 'search':
        if (isBrowserOpen && location.pathname === '/search') {
          setBrowserOpen(false);
          return;
        }
        if (!isBrowserOpen && locationString === locations.current.search) {
          setBrowserOpen(true);
          return;
        }
        navigate(locations.current.search);
        break;
      case 'settings':
        if (isBrowserOpen && location.pathname === '/settings') {
          setBrowserOpen(false);
          return;
        }
        if (!isBrowserOpen && locationString === locations.current.settings) {
          setBrowserOpen(true);
          return;
        }
        navigate(locations.current.settings);
        break;
      default:
        break;
    }
  };

  return (
    <Box alignItems="center" display="flex" flexBasis={200} flexShrink={0}>
      <IconButton
        className={isBrowserOpen && !ROUTES.includes(location.pathname) ? 'selected' : ''}
        onClick={() => handleButtonClick('library')}
      >
        <LuLibrary />
      </IconButton>
      <IconButton
        className={isBrowserOpen && location.pathname === '/search' ? 'selected' : ''}
        onClick={() => handleButtonClick('search')}
      >
        <CgSearch style={{ transform: 'rotate(90deg)' }} viewBox="1 -1 25 24" />
      </IconButton>
      <IconButton
        className={isBrowserOpen && location.pathname === '/charts' ? 'selected' : ''}
        onClick={() => handleButtonClick('charts')}
      >
        <TiChartLine />
      </IconButton>
      <IconButton
        className={isBrowserOpen && location.pathname === '/queue' ? 'selected' : ''}
        sx={{ fontSize: 23, height: 36, width: 36 }}
        onClick={() => handleButtonClick('queue')}
      >
        <BsViewList viewBox="0 3 16 16" />
        <BsViewList style={{ position: 'absolute' }} viewBox="0 -12 16 16" />
      </IconButton>
      <IconButton
        className={isBrowserOpen && location.pathname === '/settings' ? 'selected' : ''}
        onClick={() => handleButtonClick('settings')}
      >
        <MdSettings />
      </IconButton>
      <Volume />
    </Box>
  );
};

export default NavLinks;
