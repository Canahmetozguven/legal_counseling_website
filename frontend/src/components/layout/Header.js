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
  ListItemButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleNavigate = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 250,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={isActivePath(item.path)}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {!isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate('/login')}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate('/dashboard')}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

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
              sx={{ display: { md: 'none' }, mr: 2 }}
              onClick={toggleMobileDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo/Brand */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                color: 'primary.main',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              LEGAL COUNSEL
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    color: isActivePath(item.path) ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Auth Section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isAuthenticated ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                  }}
                >
                  Login
                </Button>
              ) : (
                <>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="primary"
                    sx={{ display: { xs: 'none', md: 'flex' } }}
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
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate('/dashboard');
                    }}>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
        {matches && renderMobileDrawer()}
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;