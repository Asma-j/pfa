import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import NavBar from './NavBar';
import { useLocation } from 'react-router-dom';

const ListeOffres = () => {
  const [offres, setOffres] = useState([]);
  const [societe, setSociete] = useState(null); // State pour stocker les données de la société
  const [token, setToken] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);

          const urlSearchParams = new URLSearchParams(location.search);
          const urlSocieteId = urlSearchParams.get('societeId');
          if (urlSocieteId) {
            // Appeler votre API pour récupérer les données de la société à partir de son ID
            const response = await axios.get(`http://localhost:5000/api/societe?id=${urlSocieteId}`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            // Stocker les données de la société dans le state
            setSociete(response.data.societes.find(societe => societe._id === urlSocieteId));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [location.search]);

  useEffect(() => {
    console.log('Societe:', societe); // Afficher les données de la société dans la console
    const fetchOffres = async () => {
      try {
        if (token && societe) {
          const response = await axios.get(`http://localhost:5000/api/offre?societe=${societe._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const offres = response.data.offres;
          setOffres(offres);
        }
      } catch (error) {
        console.error('Error fetching offres:', error);
      }
    };
  
    fetchOffres();
  }, [token, societe]);
  
  console.log('Offres:', offres);
  
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {societe && <h2>Liste des Offres par {societe.nom_societe}</h2>}
        <br></br>
        {offres.map((offre, index) => (
          <div key={index}>
            <div className="row">
              <div className="col-md-4 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{offre.titre}</Card.Title>
                    <Card.Text>{offre.description}</Card.Text>
                    <Button variant="primary">Postuler</Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeOffres;
