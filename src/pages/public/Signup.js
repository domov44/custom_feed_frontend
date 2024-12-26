import React, { useState, useRef } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Grid,
  Link,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom';

function Signup() {

  const [values, setValues] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useRef(null);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setGlobalError('');
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { signup } = useAuth();

  const validateForm = (formValues) => {
    const errors = {};
    if (!formValues.username) {
      errors.username = 'Ce champ est requis';
    }
    if (!formValues.password) {
      errors.password = 'Ce champ est requis';
    }
    if (!formValues.confirmPassword) {
      errors.confirmPassword = 'Ce champ est requis';
    }
    if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await signup(values.username, values.password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erreur lors de la connexion", error);
      setGlobalError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Grid container justifyContent="center" alignItems="center" style={{ height: 'calc(100vh - 69px)' }} sx={{ width: '500px' }}>
        <Paper elevation={3} sx={{ padding: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography component="h1" variant="h5">
            Signup
          </Typography>
          <form ref={form} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              id="username"
              name="username"
              label="Username"
              placeholder="Username"
              value={values.username}
              onChange={handleInput}
              error={Boolean(errors.username)}
              helperText={errors.username}
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={values.password}
              onChange={handleInput}
              error={Boolean(errors.password)}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={values.confirmPassword}
              onChange={handleInput}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
            />
            {globalError && <Typography color="error">{globalError}</Typography>}
            <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3, mb: 1 }} disabled={loading}>
              {loading ? 'Wait..' : 'Sign up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Link component={RouterLink} to="/signin" variant="body2">
                Already have an account? Signin.
              </Link>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Container>
  );
}

export default Signup;
