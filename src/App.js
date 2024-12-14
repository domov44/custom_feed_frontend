import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Home from './pages/private/Home';
import Login from './pages/public/Login';
import Profil from './pages/private/Profil';
import DefaultLayout from './components/layouts/DefaultLayout';
import Tags from './pages/private/Tags';

function App() {
  return (
    <Routes>
      {/*Début des routes publiques à partir d'ici */}
      <Route path="/se-connecter" element={<Login />} /> {/* Page login */}
      {/* Fin des routes publiques */}

      {/*Début des routes protégées à partir d'ici */}
      <Route element={<DefaultLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} /> {/*Page d'accueil */}
          <Route path="/profil" element={<Profil />} /> {/*Page d'accueil */}
          <Route path="/tags" element={<Tags />} /> {/*Page des tags */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;