import React, { useState, useRef } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login() {

  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const form = useRef(null);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setGlobalError('');
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { login } = useAuth();

  const validateForm = (formValues) => {
    const errors = {};
    if (!formValues.username) {
      errors.username = 'Ce champ est requis';
    }
    if (!formValues.password) {
      errors.password = 'Ce champ est requis';
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
      await login(values.username, values.password);
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      setGlobalError('Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Grid container justifyContent="center" alignItems="center" style={{ height: 'calc(100vh - 69px)' }} sx={{ width: '500px' }}>
        <Paper elevation={3} sx={{ padding: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <form ref={form} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              id="username"
              name="username"
              label="Nom d'utilisateur ou email"
              placeholder="Nom d'utilisateur ou email"
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
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
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
            {globalError && <Typography color="error">{globalError}</Typography>}
            <FormControlLabel
              control={
                <Checkbox checked={rememberMe} onChange={handleRememberMeChange} name="rememberMe" color="primary" />
              }
              label="Se souvenir de moi"
            />
            <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3, mb: 1 }}>
              Se connecter
            </Button>
          </form>
        </Paper>
      </Grid>
    </Container>
  );
}

export default Login;
