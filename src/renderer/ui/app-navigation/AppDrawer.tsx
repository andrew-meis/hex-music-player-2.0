import { reactive } from '@legendapp/state/react';
import {
  Box,
  ClickAwayListener,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import useHistoryStack from 'hooks/useHistoryStack';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { BsMusicNote, BsMusicNoteList } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi2';
import { IoMdMicrophone } from 'react-icons/io';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { LuLayoutGrid, LuLibrary } from 'react-icons/lu';
import { MdSettings } from 'react-icons/md';
import { createSearchParams, NavLink, Path, useNavigate } from 'react-router-dom';
import { store } from 'state';

const ReactiveDrawer = reactive(Drawer);

const listSx = {
  width: 'auto',
  marginBottom: 0.25,
  paddingX: 0.5,
  paddingY: 0.25,
  borderRadius: 2,
  color: 'text.secondary',
  transition: '100ms ease-in-out',
  '&:hover': {
    backgroundColor: 'action.hover',
    color: 'text.primary',
  },
};

const activeBox = (isActive: boolean) => ({
  width: '4px',
  height: '18px',
  marginLeft: isActive ? '4px' : '0px',
  marginRight: isActive ? '8px' : '0px',
  backgroundColor: isActive ? 'primary.main' : 'transparent',
  borderRadius: '2px',
});

const menuItems: {
  label: string;
  icon: JSX.Element;
  to: Partial<Path>;
}[] = [
  {
    label: 'Artists',
    icon: <IoMdMicrophone />,
    to: {
      pathname: '/artists',
      search: createSearchParams({
        section: 'Artists',
      }).toString(),
    },
  },
  {
    label: 'Albums',
    icon: <BiSolidAlbum />,
    to: {
      pathname: '/albums',
      search: createSearchParams({
        section: 'Albums',
      }).toString(),
    },
  },
  {
    label: 'Tracks',
    icon: <BsMusicNote />,
    to: {
      pathname: '/tracks',
      search: createSearchParams({
        section: 'Tracks',
      }).toString(),
    },
  },
  {
    label: 'Playlists',
    icon: <BsMusicNoteList />,
    to: {
      pathname: '/playlists',
      search: createSearchParams({
        section: 'Playlists',
      }).toString(),
    },
  },
  {
    label: 'Genres',
    icon: <FaTags />,
    to: {
      pathname: '/genres',
      search: createSearchParams({
        section: 'Genres',
      }).toString(),
    },
  },
  {
    label: 'Collections',
    icon: <LuLayoutGrid />,
    to: {
      pathname: '/collections',
      search: createSearchParams({
        section: 'Collections',
      }).toString(),
    },
  },
];

const DrawerContent: React.FC = () => {
  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.navigation.drawer.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.navigation.drawer.get()} anchor="left">
      <ClickAwayListener onClickAway={handleClose}>
        <Box height="calc(100vh - 244px)" maxHeight={600} width="clamp(212px, 25vw, 256px)">
          <List disablePadding>
            <NavLink end className="link" style={{ textDecoration: 'none' }} to="/">
              {({ isActive }) => (
                <ListItem sx={listSx}>
                  <Box sx={activeBox(isActive)} />
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <HiHome />
                  </ListItemIcon>
                  <ListItemText>Home</ListItemText>
                </ListItem>
              )}
            </NavLink>
            <NavLink end className="link" style={{ textDecoration: 'none' }} to="/settings">
              {({ isActive }) => (
                <ListItem sx={listSx}>
                  <Box sx={activeBox(isActive)} />
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <MdSettings />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </ListItem>
              )}
            </NavLink>
            <Divider sx={{ marginBottom: 0.25, marginX: 1 }} />
            {menuItems.map((item) => (
              <NavLink
                end
                className="link"
                key={item.label}
                style={{ textDecoration: 'none' }}
                to={item.to}
              >
                {({ isActive }) => (
                  <ListItem sx={listSx}>
                    <Box sx={activeBox(isActive)} />
                    <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                    <ListItemText>{item.label}</ListItemText>
                  </ListItem>
                )}
              </NavLink>
            ))}
          </List>
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

const AppDrawer: React.FC = () => {
  const navigate = useNavigate();

  const { backward, forward } = useHistoryStack();

  return (
    <Box display="flex" justifySelf="start">
      <IconButton onClick={() => store.ui.navigation.drawer.set(true)}>
        <LuLibrary />
      </IconButton>
      <IconButton disabled={!backward} onClick={() => navigate(-1)}>
        <IoChevronBack />
      </IconButton>
      <IconButton disabled={!forward} onClick={() => navigate(1)}>
        <IoChevronForward />
      </IconButton>
      <DrawerContent />
    </Box>
  );
};

export default AppDrawer;
