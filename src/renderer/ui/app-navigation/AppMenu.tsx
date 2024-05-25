import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import useHistoryStack from 'hooks/useHistoryStack';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { BsMusicNote, BsMusicNoteList } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { IoMdMicrophone } from 'react-icons/io';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { LuLayoutGrid, LuLibrary } from 'react-icons/lu';
import { MdHome, MdSettings } from 'react-icons/md';
import { createSearchParams, Path, useLocation, useNavigate } from 'react-router-dom';

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

const AppMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { backward, forward } = useHistoryStack();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (to: Partial<Path>) => {
    if (location.pathname !== to.pathname) {
      navigate(to);
    }
    setTimeout(() => setAnchorEl(null), 300);
  };

  return (
    <Box display="flex" justifySelf="start">
      <IconButton onClick={handleClick}>
        <LuLibrary />
      </IconButton>
      <IconButton disabled={!backward} onClick={() => navigate(-1)}>
        <IoChevronBack />
      </IconButton>
      <IconButton disabled={!forward} onClick={() => navigate(1)}>
        <IoChevronForward />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect({ pathname: '/' })}>
          <ListItemIcon>
            <MdHome />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
        <Divider sx={{ margin: '4px !important' }} />
        {menuItems.map((item) => (
          <MenuItem key={item.label} onClick={() => handleSelect(item.to)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
        <Divider sx={{ margin: '4px !important' }} />
        <MenuItem onClick={() => handleSelect({ pathname: '/settings' })}>
          <ListItemIcon>
            <MdSettings />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AppMenu;
