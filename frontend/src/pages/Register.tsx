import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setPasswordError('');
    
    // Simple validation
    if (!name || !email || !password || !confirmPassword) return;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Check password length
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          className="p-8 mt-12 flex flex-col items-center rounded-xl shadow-xl"
        >
          <Typography component="h1" variant="h4" className="mb-6">
            Create Account
          </Typography>

          {error && <Alert severity="error" className="mb-4 w-full">{error}</Alert>}
          {passwordError && <Alert severity="error" className="mb-4 w-full">{passwordError}</Alert>}

          <Box component="form" onSubmit={handleSubmit} className="w-full">
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={submitted && !name}
              helperText={submitted && !name ? 'Name is required' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={submitted && !email}
              helperText={submitted && !email ? 'Email is required' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={submitted && !password}
              helperText={submitted && !password ? 'Password is required' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={submitted && !confirmPassword}
              helperText={submitted && !confirmPassword ? 'Please confirm your password' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="mt-6 mb-4 h-12"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            <Box className="text-center mt-4">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline"
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register; 