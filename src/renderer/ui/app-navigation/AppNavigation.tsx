import { Box } from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import AppBreadcrumbs from './AppBreadcrumbs';
import AppLinks from './AppLinks';
import AppMenu from './AppMenu';

const AppNavigation: React.FC = () => {
  const location = useLocation();

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

  return (
    <Box display="block" marginX={1} position="fixed" top={32} width="-webkit-fill-available">
      <Box
        alignContent="center"
        display="grid"
        height={40}
        justifyItems="center"
        marginX="auto"
        maxWidth={1920}
        sx={{
          gridTemplateColumns: '1fr auto 1fr',
        }}
      >
        <AppMenu />
        <AppBreadcrumbs />
        <AppLinks locations={locations} />
      </Box>
    </Box>
  );
};

export default AppNavigation;
