import React, { useState } from 'react';
import { Routes, Route, BrowserRouter as Router, useNavigate, Navigate } from 'react-router-dom'; // Importez Navigate depuis react-router-dom
import Login from './Components/auth/Login';
import Home from './Components/Candidat/Home';
import Register from './Components/auth/Register';
import Dashboard from './Components/Societe/dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router> {/* Enveloppez votre application avec le composant Router */}
      <div>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
             <Route path="/register" element={<Register/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
