import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    setPasswordError('');
    
    // Check if passwords match if password field is not empty
    if (password && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Check password length if provided
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Only include fields that have been changed
      const updateData: { name?: string; email?: string; password?: string } = {};
      
      if (name !== user?.name) updateData.name = name;
      if (email !== user?.email) updateData.email = email;
      if (password) updateData.password = password;
      
      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
        setSuccessMessage('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
        setIsEditing(false);
      } else {
        setSuccessMessage('No changes detected');
      }
    } catch (err) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} className="p-8 my-8 rounded-xl shadow-xl">
          <Box className="flex flex-col items-center mb-6">
            <Avatar
              alt={user?.name}
              src="/avatar.png"
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography component="h1" variant="h4" gutterBottom>
              Profile
            </Typography>
            {!isEditing && (
              <Typography variant="body1" color="text.secondary">
                Manage your account information
              </Typography>
            )}
          </Box>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {passwordError && <Alert severity="error" className="mb-4">{passwordError}</Alert>}
          {successMessage && <Alert severity="success" className="mb-4">{successMessage}</Alert>}

          {!isEditing ? (
            // Profile Display
            <Box className="flex flex-col gap-6">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="h6">{user?.name}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="h6">{user?.email}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1" className="break-all">{user?._id}</Typography>
              </Box>
              <Box className="flex justify-center mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setIsEditing(true)}
                  className="min-w-[200px]"
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          ) : (
            // Edit Form
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="New Password (leave blank to keep current)"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <TextField
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!password && !confirmPassword}
                  helperText={!!password && !confirmPassword ? 'Please confirm your password' : ''}
                />
              )}
              <Box className="flex justify-between mt-6">
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                    setPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  className="min-w-[120px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Profile; 