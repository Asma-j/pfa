import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Login from './Components/auth/Login';
import Home from './Components/Candidat/Home';
import Register from './Components/auth/Register';
import Dashboard from './Components/Societe/Dashboard';
import AddOfferPage from './Components/Societe/AddOfferPage';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [societeId, setSocieteId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setAuthenticated(true);
        await getSocieteId(storedToken); // Fetch société ID if authenticated
      }
    };
    checkAuthentication();
  }, []);

  const getSocieteId = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/societe', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSocieteId(data.societeId);
    } catch (error) {
      console.error(error);
    }
  };
  const onLogin = (token, societeId) => {
    console.log("Logged-in token: " + token);
    console.log("Logged-in societyId: " + societeId);
  };
  
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />

          <Route path="/" element={authenticated ? <Home societeId={societeId} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={authenticated ? <Dashboard societeId={societeId} /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addOffre" element={authenticated ? <AddOfferPage /> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
