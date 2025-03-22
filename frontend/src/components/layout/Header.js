import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

// Hide header on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const toggleMobileDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMobileDrawerOpen(open);
  };

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Practice Areas', path: '/practice-areas' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <HideOnScroll>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 2 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="menu"
              sx={{ display: { sm: 'none' }, mr: 2 }}
              onClick={toggleMobileDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo/Brand */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: { xs: 1, sm: 0 },
                mr: { sm: 4 },
                color: 'primary.main',
                fontFamily: '"Libre Baskerville", serif',
                fontWeight: 700
              }}
            >
              Law Firm
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              flexGrow: 1,
              gap: 2
            }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="primary"
                  onClick={() => navigate(item.path)}
                  sx={{
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: 'primary.main',
                      transform: isActivePath(item.path) ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease'
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Auth Section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated() ? (
                <>
                  <Button
                    color="primary"
                    onClick={() => navigate('/dashboard')}
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    Dashboard
                  </Button>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="primary"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              )}
            </Box>

            {/* Mobile Navigation Drawer */}
            <Drawer
              anchor="left"
              open={mobileDrawerOpen}
              onClose={toggleMobileDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleMobileDrawer(false)}
                onKeyDown={toggleMobileDrawer(false)}
              >
                <List>
                  {navigationItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton 
                        onClick={() => navigate(item.path)}
                        selected={isActivePath(item.path)}
                      >
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {isAuthenticated() && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => navigate('/dashboard')}>
                        <ListItemText primary="Dashboard" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;