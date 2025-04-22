import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <Container component="main" maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center"
      >
        <Typography 
          variant="h1" 
          component="h1" 
          className="text-8xl font-bold text-gray-800"
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          className="mt-4 mb-6"
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          className="mb-8 text-gray-600"
        >
          The page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </Typography>
        
        <Box>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            size="large"
          >
            Go to Homepage
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default NotFound; 