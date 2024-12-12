import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Home from './pages/private/Home';
import Login from './pages/public/Login';

function App() {
  return (
    <Routes>
      {/*Début des routes publiques à partir d'ici */}
      <Route path="/se-connecter" element={<Login />} /> {/* Page login */}
      {/* Fin des routes publiques */}

      {/*Début des routes protégées à partir d'ici */}
      <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} /> {/*Page d'accueil */}
    </Routes>
  );
}

export default App;