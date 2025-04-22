import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            {user && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
                onClick={() => toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              FULLSTACK
            </Typography>

            {/* Desktop Navigation */}
            {user && (
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  }}
                >
                  Dashboard
                </Button>
              </Box>
            )}

            {/* User Menu */}
            {user ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src="/avatar.png" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => {
                    handleCloseUserMenu();
                    navigate('/profile');
                  }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0, display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: '8px' }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white', borderRadius: '8px' }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Sidebar Drawer */}
      {user && (
        <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
          <Toolbar /> {/* Spacing for AppBar */}
          <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/" selected={location.pathname === '/'}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/profile" selected={location.pathname === '/profile'}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar /> {/* Spacing for AppBar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout; 