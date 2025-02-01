import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Home from './pages/private/Home';
import Login from './pages/public/Login';
import Profil from './pages/private/Profil';
import DefaultLayout from './components/layouts/DefaultLayout';
import Tags from './pages/private/Tags';
import Signup from './pages/public/Signup';
import { ROUTES } from './routes';

function App() {
  return (
    <Routes>
      {/*  publics routes */}
      <Route path={ROUTES.SIGNIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />

      {/* private route */}
      <Route element={<DefaultLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PROFILE} element={<Profil />} />
          <Route path={ROUTES.TAG} element={<Tags />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;