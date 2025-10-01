import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Memory as MemoryIcon,
  Psychology as ReasoningIcon,
  School as LearningIcon,
  TrendingUp as EvolutionIcon,
  Monitor as SystemIcon,
  AdminPanelSettings as AdminIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAGIStore } from '../../store/agiStore';

// Navigation items
const navigationItems = [
  {
    path: '/',
    label: 'Chat Interface',
    icon: ChatIcon,
    description: 'Interact with AGI',
    badge: 'active',
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    description: 'System overview and status',
  },
  {
    path: '/memory',
    label: 'Memory Viewer',
    icon: MemoryIcon,
    description: 'Browse and manage memories',
  },
  {
    path: '/reasoning',
    label: 'Reasoning Analyzer',
    icon: ReasoningIcon,
    description: 'Analyze reasoning processes',
  },
  {
    path: '/learning',
    label: 'Learning Center',
    icon: LearningIcon,
    description: 'Monitor learning progress',
  },
  {
    path: '/evolution',
    label: 'Evolution Monitor',
    icon: EvolutionIcon,
    description: 'Track system evolution',
  },
  {
    path: '/system',
    label: 'System Monitor',
    icon: SystemIcon,
    description: 'System health and metrics',
  },
  {
    path: '/admin',
    label: 'Admin Panel',
    icon: AdminIcon,
    description: 'System administration',
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, connectionStatus } = useAGIStore();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? 280 : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? 280 : 80,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          minHeight: 64,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AIIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    Atulya Tantra
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
                    AGI System
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
            },
          }}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Connection Status */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          gap: 1,
        }}
      >
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
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        />
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {connectionStatus === 'connected'
                  ? 'Connected'
                  : connectionStatus === 'connecting'
                  ? 'Connecting...'
                  : 'Disconnected'}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip
                title={!sidebarOpen ? item.label : ''}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    px: sidebarOpen ? 2 : 1.5,
                    backgroundColor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 229, 255, 0.05)',
                      border: '1px solid rgba(0, 229, 255, 0.2)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: sidebarOpen ? 40 : 'auto',
                      color: isActive ? 'primary.main' : 'text.secondary',
                      justifyContent: 'center',
                    }}
                  >
                    <Badge
                      badgeContent={item.badge ? 1 : 0}
                      color="secondary"
                      variant="dot"
                      invisible={!item.badge}
                    >
                      <Icon />
                    </Badge>
                  </ListItemIcon>

                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ width: '100%' }}
                      >
                        <ListItemText
                          primary={item.label}
                          secondary={item.description}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'primary.main' : 'text.primary',
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
        }}
      >
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                v1.0.0 - Production
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Drawer>
  );
};

export default Sidebar;