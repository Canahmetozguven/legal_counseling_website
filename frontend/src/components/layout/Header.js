import React, { useState, useEffect } from 'react';
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
  useMediaQuery,
  Divider,
  ListItemIcon
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

// Hide header on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,  // Only hide after scrolling 100px
  });

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isScrolled, setIsScrolled] = useState(false);

  // Check scroll position to apply styling changes
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

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

  // Primary navigation items
  const navigationItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Practice Areas', path: '/practice-areas', icon: <GavelIcon /> },
    { name: 'Our Team', path: '/about', icon: <GroupsIcon /> },
    { name: 'Resources', path: '/blog', icon: <ArticleIcon /> },
    { name: 'Contact Us', path: '/contact', icon: <ContactSupportIcon /> }
  ];

  // Quick access buttons for key legal services
  const legalQuickLinks = [
    { name: 'Free Consultation', path: '/contact', highlight: true },
    { name: 'Client Portal', path: '/client-portal', highlight: false }
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
          width: 280,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ pt: 5, pb: 3, textAlign: 'center' }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            letterSpacing: 0.5,
            pb: 2,
          }}
        >
          LEGAL COUNSEL
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expert Legal Services
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={isActivePath(item.path)}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 40, 85, 0.08)',
                  borderRight: `4px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 40, 85, 0.12)',
                  }
                },
              }}
            >
              <ListItemIcon sx={{ color: isActivePath(item.path) ? theme.palette.primary.main : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{
                  fontWeight: isActivePath(item.path) ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 2, mb: 2 }} />
      
      <Box sx={{ px: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={() => handleNavigate('/contact')}
          startIcon={<PhoneIcon />}
          sx={{ mb: 1.5 }}
        >
          Free Consultation
        </Button>
      </Box>
      
      <Divider />
      
      {isAuthenticated ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <Box sx={{ px: 3, mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleNavigate('/login')}
          >
            Client Login
          </Button>
        </Box>
      )}
    </Drawer>
  );

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: isScrolled ? 'white' : 'rgba(255, 255, 255, 0.96)',
          color: theme.palette.primary.main,
          boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: { xs: 64, md: 80 } }}>
            {/* Mobile Menu Icon */}
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ 
                display: { md: 'none' }, 
                mr: 2,
                color: theme.palette.primary.main 
              }}
              onClick={toggleMobileDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo/Brand */}
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: 0.5,
                cursor: 'pointer',
                fontFamily: '"Merriweather", serif',
              }}
              onClick={() => navigate('/')}
            >
              LEGAL COUNSEL
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 6, gap: 0.5 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 2.5,
                    color: theme.palette.text.primary,
                    position: 'relative',
                    fontWeight: isActivePath(item.path) ? 600 : 400,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 40, 85, 0.04)',
                    },
                    '&::after': isActivePath(item.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '3px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px 2px 0 0'
                    } : {}
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Quick Access Buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      borderRadius: 2,
                      px: 2
                    }}
                  >
                    Client Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/contact')}
                    sx={{ 
                      borderRadius: 2,
                      px: 2
                    }}
                  >
                    Free Consultation
                  </Button>
                </>
              ) : (
                <>
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
                    sx={{
                      '& .MuiPaper-root': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        borderRadius: 2,
                      }
                    }}
                  >
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate('/dashboard');
                    }}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
        {isMobile && renderMobileDrawer()}
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
