import React, { useState } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Login from './Components/auth/Login';
import Home from './Components/Candidat/Home';
import Register from './Components/auth/Register';
import Dashboard from './Components/Societe/Dashboard';
import AddOfferPage from './Components/Societe/AddOfferPage';

const isAuthenticated = () => {

  return localStorage.getItem('token') !== null;
};


const App = () => {
  
  const onLogin = (token, societeId) => {
    
    console.log("Logged-in token: " + token);
    console.log("Logged-in societyId: " + societeId);
 
  };
  const [societeId, setSocieteId] = useState(null);
const [token, setToken] = useState(null);
const getSocieteId = async () => {
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
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated() ? <Dashboard societeId={societeId}/> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addOffre" element={isAuthenticated() ? <AddOfferPage /> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
