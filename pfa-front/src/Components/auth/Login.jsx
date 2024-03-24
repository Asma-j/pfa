import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import recrutementImage from '../auth/img/marketing.jpg'; // Importer l'image

const Login = ({ onLogin }) => { // Passer la fonction onLogin comme une prop
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const navigate = useNavigate();


    const handleLoginSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/login', { email, password })
            .then(async response => {
                console.log(response);
                // Assuming the response contains the JWT token
                const token = response.data.token;
                
                // Include the token in the request headers
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
    
                // Make a GET request to get user role
                axios.get('http://localhost:5000/api/user-role', config)
                    .then(roleResponse => {
                        if (roleResponse.data.role === 'Admin' || roleResponse.data.role === 'Societe') {
                            navigate("/dashboard");
                        } else if (roleResponse.data.role === 'Candidat') {
                            onLogin(); // Appel de la fonction onLogin après une connexion réussie
                            navigate("/");
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    };
    
    return (
        <div>
            <header className="bg-dark text-white py-3">
                <div className="container text-center">
                    <h1 className="mb-0">Connexion</h1>
                </div>
            </header>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        {/* Utilisation de l'image importée */}
                        <img src={recrutementImage} alt="Recrutement" className="img-fluid" />
                    </div>
                    <div className="col-md-6">
                        {/* Formulaire de connexion */}
                        <main className="container py-4">
                            <form onSubmit={handleLoginSubmit}>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mot de passe:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        onChange={(e) => setPass(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Se connecter</button>
                                <Link to="/register" className="btn btn-secondary">S'inscrire</Link>
                            </form>
                        </main>
                    </div>
                </div>
            </div>
            <footer className="bg-dark text-white py-3">
                <div className="container text-center">
                    <p className="mb-0">&copy; 2024 Plateforme de Recrutement</p>
                </div>
            </footer>
        </div>
    );
}

export default Login;
