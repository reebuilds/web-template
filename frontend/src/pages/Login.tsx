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

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Simple validation
    if (!email || !password) return;
    
    try {
      await login(email, password);
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
          className="p-8 mt-20 flex flex-col items-center rounded-xl shadow-xl"
        >
          <Typography component="h1" variant="h4" className="mb-6">
            Sign In
          </Typography>

          {error && <Alert severity="error" className="mb-4 w-full">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} className="w-full">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={submitted && !password}
              helperText={submitted && !password ? 'Password is required' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="mt-6 mb-4 h-12"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Box className="text-center mt-4">
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline"
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login; 