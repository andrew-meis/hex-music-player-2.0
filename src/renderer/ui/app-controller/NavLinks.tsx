import { Box, IconButton, SvgIcon } from '@mui/joy';
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
      <IconButton variant="plain" onClick={() => handleButtonClick('library')}>
        <SvgIcon
          color={isBrowserOpen && !ROUTES.includes(location.pathname) ? 'primary' : 'neutral'}
        >
          <LuLibrary />
        </SvgIcon>
      </IconButton>
      <IconButton variant="plain" onClick={() => handleButtonClick('search')}>
        <SvgIcon color={isBrowserOpen && location.pathname === '/search' ? 'primary' : 'neutral'}>
          <CgSearch style={{ transform: 'rotate(90deg)' }} viewBox="1 -1 25 24" />
        </SvgIcon>
      </IconButton>
      <IconButton variant="plain" onClick={() => handleButtonClick('charts')}>
        <SvgIcon color={isBrowserOpen && location.pathname === '/charts' ? 'primary' : 'neutral'}>
          <TiChartLine />
        </SvgIcon>
      </IconButton>
      <IconButton
        sx={{
          '--IconButton-size': '34px',
        }}
        variant="plain"
        onClick={() => handleButtonClick('queue')}
      >
        <SvgIcon color={isBrowserOpen && location.pathname === '/queue' ? 'primary' : 'neutral'}>
          <BsViewList viewBox="0 3 16 16" />
          <BsViewList style={{ position: 'absolute' }} viewBox="0 -12 16 16" />
        </SvgIcon>
      </IconButton>
      <IconButton variant="plain" onClick={() => handleButtonClick('settings')}>
        <SvgIcon color={isBrowserOpen && location.pathname === '/settings' ? 'primary' : 'neutral'}>
          <MdSettings />
        </SvgIcon>
      </IconButton>
      <Volume />
    </Box>
  );
};

export default NavLinks;
