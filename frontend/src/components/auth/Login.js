import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#115293',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check for lock status in localStorage
  useEffect(() => {
    const lockedUntil = localStorage.getItem('loginLockedUntil');
    if (lockedUntil && parseInt(lockedUntil) > Date.now()) {
      setIsLocked(true);
      const remainingTime = Math.ceil((parseInt(lockedUntil) - Date.now()) / 1000);
      setLockTimer(remainingTime);
      
      // Start countdown timer
      const interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            localStorage.removeItem('loginLockedUntil');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (lockedUntil) {
      localStorage.removeItem('loginLockedUntil');
    }
  }, []);

  const validateInput = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!EMAIL_REGEX.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input before storing
    const sanitizedValue = DOMPurify.sanitize(value);
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    
    // Validate on change
    setFormErrors({
      ...formErrors,
      [name]: validateInput(name, sanitizedValue)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Final validation before submission
    const emailError = validateInput('email', formData.email);
    const passwordError = validateInput('password', formData.password);
    
    setFormErrors({
      email: emailError,
      password: passwordError
    });
    
    // Stop if there are validation errors
    if (emailError || passwordError) {
      return;
    }
    
    // Check if account is locked
    if (isLocked) {
      setError(`Too many failed attempts. Try again in ${lockTimer} seconds.`);
      return;
    }
    
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
      // Reset attempt count on successful login
      setAttemptCount(0);
      localStorage.removeItem('loginAttempts');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
      
      // Increment attempt counter
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      
      // Lock account after 5 failed attempts
      if (newAttemptCount >= 5) {
        const lockDuration = 60; // 1 minute (in seconds)
        const lockedUntil = Date.now() + (lockDuration * 1000);
        localStorage.setItem('loginLockedUntil', lockedUntil.toString());
        setIsLocked(true);
        setLockTimer(lockDuration);
        setError(`Too many failed attempts. Account locked for ${lockDuration} seconds.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography component="h1" variant="h4" color="primary" gutterBottom>
              Legal Counsel
            </Typography>
            <Typography component="h2" variant="h5" color="primary" sx={{ mb: 3 }}>
              Login
            </Typography>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {isLocked && (
              <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>
                Account temporarily locked. Please try again in {lockTimer} seconds.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                inputProps={{
                  maxLength: 100,
                  'data-testid': 'email-input' 
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                inputProps={{
                  maxLength: 100,
                  'data-testid': 'password-input'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  height: '48px',
                  position: 'relative',
                }}
                disabled={loading || isLocked}
                data-testid="login-button"
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ position: 'absolute' }} />
                ) : (
                  'Login'
                )}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
