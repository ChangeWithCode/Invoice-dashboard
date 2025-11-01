import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4,
  Brightness7,
  Person,
  Settings,
  Logout,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const TopAppBar = ({ onMenuClick, drawerWidth }) => {
  const { state, dispatch } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === 'light' ? 'dark' : 'light',
    });
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            position: 'relative',
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            },
            marginRight: 2,
            marginLeft: { xs: 0, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { sm: '400px' },
          }}
        >
          <Box
            sx={{
              padding: '0 16px',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search invoices, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: 'inherit',
              padding: '8px 8px 8px 48px',
              width: '100%',
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Toggle theme">
          <IconButton color="inherit" onClick={toggleTheme}>
            {state.theme === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={handleProfileMenuOpen}
          size="small"
          sx={{ ml: 2 }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            {state.user.name.charAt(0)}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Person sx={{ mr: 2 }} fontSize="small" />
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem>
            <Settings sx={{ mr: 2 }} fontSize="small" />
            <Typography>Settings</Typography>
          </MenuItem>
          <MenuItem>
            <Logout sx={{ mr: 2 }} fontSize="small" />
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;