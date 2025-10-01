import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Refresh as RefreshIcon,
  PowerSettingsNew as PowerIcon,
  AdminPanelSettings as AdminIcon,
  Code as DeveloperIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAGIStore } from '../../store/agiStore';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const {
    sidebarOpen,
    connectionStatus,
    systemStatus,
    isTyping,
  } = useAGIStore();

  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const getStatusColor = () => {
    if (!systemStatus) return 'default';
    switch (systemStatus.status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    if (!systemStatus) return 'Unknown';
    return systemStatus.status.charAt(0).toUpperCase() + systemStatus.status.slice(1);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginLeft: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Left side - Page title and status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AGI Control Center
            </Typography>
          </motion.div>

          {/* System Status */}
          <Chip
            label={getStatusText()}
            color={getStatusColor()}
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '& .MuiChip-label': {
                fontSize: '0.75rem',
                fontWeight: 500,
              },
            }}
          />

          {/* Connection Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor:
                  connectionStatus === 'connected'
                    ? '#4caf50'
                    : connectionStatus === 'connecting'
                    ? '#ff9800'
                    : '#f44336',
                animation: connectionStatus === 'connecting' ? 'pulse 1.5s infinite' : 'none',
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {connectionStatus === 'connected'
                ? 'Online'
                : connectionStatus === 'connecting'
                ? 'Connecting'
                : 'Offline'}
            </Typography>
          </Box>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Chip
                label="AGI is thinking..."
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                  color: 'primary.main',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            </motion.div>
          )}
        </Box>

        {/* Right side - Actions and user menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* System Metrics */}
          {systemStatus && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  CPU
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {systemStatus.cpu_usage.toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Memory
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {systemStatus.memory_usage.toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Uptime
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {Math.floor(systemStatus.uptime / 3600)}h
                </Typography>
              </Box>
            </Box>
          )}

          {/* Action buttons */}
          <Tooltip title="Refresh System Status">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                },
              }}
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* User menu */}
          {isAuthenticated ? (
            <>
              {/* Role indicator */}
              <Chip
                label={user?.role}
                size="small"
                icon={
                  user?.role === 'admin' ? (
                    <AdminIcon />
                  ) : user?.role === 'developer' ? (
                    <DeveloperIcon />
                  ) : (
                    <AccountIcon />
                  )
                }
                sx={{
                  backgroundColor: 
                    user?.role === 'admin' 
                      ? 'rgba(255, 64, 129, 0.1)'
                      : user?.role === 'developer'
                      ? 'rgba(0, 229, 255, 0.1)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 
                    user?.role === 'admin' 
                      ? '#ff4081'
                      : user?.role === 'developer'
                      ? '#00e5ff'
                      : 'text.primary',
                  border: `1px solid ${
                    user?.role === 'admin' 
                      ? 'rgba(255, 64, 129, 0.3)'
                      : user?.role === 'developer'
                      ? 'rgba(0, 229, 255, 0.3)'
                      : 'rgba(255, 255, 255, 0.3)'
                  }`,
                  mr: 1,
                }}
              />

              <Tooltip title={`${user?.username} (${user?.role})`}>
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    },
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/auth')}
              sx={{
                borderColor: 'rgba(0, 229, 255, 0.5)',
                color: '#00e5ff',
                '&:hover': {
                  borderColor: '#00e5ff',
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                mt: 1,
                minWidth: 200,
              },
            }}
          >
            {/* User info header */}
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.username}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user?.email}
              </Typography>
            </Box>

            <MenuItem onClick={handleProfile}>
              <AccountIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <SettingsIcon sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            
            {/* Role-specific menu items */}
            {hasRole('admin') && (
              <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                <AdminIcon sx={{ mr: 1 }} />
                Admin Panel
              </MenuItem>
            )}
            
            {hasRole('developer') && (
              <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                <DeveloperIcon sx={{ mr: 1 }} />
                Dashboard
              </MenuItem>
            )}
            
            <MenuItem onClick={handleLogout} sx={{ color: '#ff4081' }}>
              <PowerIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;