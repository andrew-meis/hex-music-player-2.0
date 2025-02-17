import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
} from '@mui/material';
import React, { useState } from 'react';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { MdRefresh, MdSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const AppMenu: React.FC = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    console.log('refresh');
    setTimeout(() => setAnchorEl(null), 300);
  };

  const handleSettings = () => {
    navigate('/settings');
    setTimeout(() => setAnchorEl(null), 300);
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen}>
        <SvgIcon sx={{ width: 20, height: 20 }}>
          <HiOutlineMenuAlt2 />
        </SvgIcon>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleRefresh}>
          <ListItemIcon>
            <MdRefresh />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>
        <Divider sx={{ margin: '4px !important' }} />
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <MdSettings />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AppMenu;
