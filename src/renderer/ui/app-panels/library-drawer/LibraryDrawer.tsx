import { reactive } from '@legendapp/state/react';
import {
  Box,
  ClickAwayListener,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { BsMusicNote, BsMusicNoteList } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { HiHeart, HiHome } from 'react-icons/hi2';
import { IoMdMicrophone } from 'react-icons/io';
import { LuLayoutGrid } from 'react-icons/lu';
import { MdSettings } from 'react-icons/md';
import { TiChartLine } from 'react-icons/ti';
import { createSearchParams, NavLink, Path } from 'react-router-dom';
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

const LibraryDrawer: React.FC = () => {
  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.library.open.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.library.open.get()} anchor="left">
      <ClickAwayListener onClickAway={handleClose}>
        <Box display="flex" flexDirection="column" height={1}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
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
            <NavLink end className="link" style={{ textDecoration: 'none' }} to="/charts">
              {({ isActive }) => (
                <ListItem sx={listSx}>
                  <Box sx={activeBox(isActive)} />
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <TiChartLine />
                  </ListItemIcon>
                  <ListItemText>Charts</ListItemText>
                </ListItem>
              )}
            </NavLink>
            <NavLink end className="link" style={{ textDecoration: 'none' }} to="/favorites">
              {({ isActive }) => (
                <ListItem sx={listSx}>
                  <Box sx={activeBox(isActive)} />
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <HiHeart />
                  </ListItemIcon>
                  <ListItemText>Favorites</ListItemText>
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
            <Divider sx={{ marginTop: 'auto', marginBottom: 0.25, marginX: 1 }} />
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
          </List>
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default LibraryDrawer;
