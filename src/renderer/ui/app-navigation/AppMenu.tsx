import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { LuLibrary } from 'react-icons/lu';
import { MdSettings } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const AppMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <>
      <IconButton sx={{ justifySelf: 'start' }} onClick={handleClick}>
        <LuLibrary />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleSelect}>
          <ListItemIcon>
            <MdSettings />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AppMenu;
