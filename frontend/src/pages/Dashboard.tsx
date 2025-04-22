import { useEffect, useState } from 'react';
import { Typography, Box, Card, CardContent, Grid, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [serverStatus, setServerStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check server health on component mount
    const checkServerHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        if (data.status === 'ok') {
          setServerStatus('Online');
        } else {
          setServerStatus('Offline');
        }
      } catch (error) {
        setServerStatus('Offline');
      }
    };

    checkServerHealth();
  }, []);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <Box>
      <Box className="mb-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is your personal dashboard. Here you can monitor your activity and system status.
        </Typography>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={4}>
          {/* Status Card */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Server Status
                  </Typography>
                  <Box className="flex items-center mt-4">
                    <Box
                      className={`w-3 h-3 rounded-full mr-2 ${
                        serverStatus === 'Online' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <Typography>{serverStatus}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* User Info Card */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Your Information
                  </Typography>
                  <Box className="mt-4">
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography className="mb-2">{user?.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography className="truncate">{user?._id}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Usage Stats Card */}
          <Grid item xs={12} sm={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Usage Statistics
                  </Typography>
                  <Box className="mt-4">
                    <Box className="mb-2">
                      <Typography variant="body2" color="text.secondary">
                        Login Status
                      </Typography>
                      <Typography>Active</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Login
                      </Typography>
                      <Typography>Just now</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Additional Information */}
      <Paper className="p-6 mt-8 bg-blue-50">
        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1">
          This is a full-stack application built with React, TypeScript, Express, and MongoDB.
          It features authentication, protected routes, and a responsive UI.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard; 