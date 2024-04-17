import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import NavBar from '../NavBar';
import SideBar from '../SideBar';

const Offres = () => {
    const [offres, setOffres] = useState([]);
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchOffres = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);

                    const urlSocieteId = localStorage.getItem('societeId');
                    const response = await axios.get(`http://localhost:5000/api/offre?societe=${urlSocieteId}`, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });
                    const offres = response.data.offres;
                    setOffres(offres);
                }
            } catch (error) {
                console.error('Error fetching offres:', error);
            }
        };

        fetchOffres();
    }, []);

    const handleAjouter = () => {
        // Implémenter la logique pour ajouter une nouvelle offre
    };

    return (<div><NavBar />
        <div className="d-flex">
            <SideBar />
            <div className="container">

                <h1>Liste des Offres</h1>
                <Button variant="primary" > <Link to="/addOffre" className="nav-link d-none d-sm-inline px-1"> Ajouter Offre </Link></Button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Date d'expiration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offres ? (
                            offres.map(offre => (
                                <tr key={offre._id}>
                                    <td>{offre.titre}</td>
                                    <td>{offre.description}</td>
                                    <td>{new Date(offre.dateExp).toLocaleDateString()}</td>
                                    <td>
  <Button variant="success">Modifier</Button>{' '}
  <Button variant="danger">Supprimer</Button>{' '}
  <Button variant="info">Ajouter Quiz</Button>
</td>


                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Aucune offre disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
};

export default Offres;
