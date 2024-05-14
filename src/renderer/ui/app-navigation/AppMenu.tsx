import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import useHistoryStack from 'hooks/useHistoryStack';
import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { LuLibrary } from 'react-icons/lu';
import { MdSettings } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const handleSelect = () => {
    if (location.pathname !== '/settings') {
      navigate('/settings');
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
        <MenuItem onClick={handleSelect}>
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
