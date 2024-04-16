import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importer Link depuis react-router-dom
import axios from 'axios';
import quiz from '../auth/img/image7.png';
import defaultAvatar from '../auth/img/images (1).png'; 
import { Image , Form, FormControl, Button } from 'react-bootstrap';
import NavBar from './NavBar';

const Home = () => {
  const [societes, setSocietes] = useState(null); // Initialiser avec null
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/societe', {
        params: {
          name: searchName,
          address: searchAddress
        }
      });
  
      console.log('Response:', response); 
      if (response.data.societes) {
        setSocietes(response.data.societes); 
      } else {
        console.error('Data received is undefined:', response.data.societes);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleSearch = () => {
    fetchData();
  };

  return (
    <div>
      <NavBar/>
      <div className="container mt-4">
        <Image src={quiz} fluid className="my-4" /> 
        <h2>Présentation de Notre Application</h2>
        <p>
          Bienvenue dans notre application de gestion d'emploi révolutionnaire ! Avant de soumettre votre CV, nous vous invitons à passer un quiz rapide conçu pour mieux vous connaître et comprendre vos compétences
        </p>
       
        <Form inline className="mb-4">
          <div className='row'>
            <div className='col-md-4'>
              <FormControl 
                type="text" 
                placeholder="Rechercher par nom" 
                className="mr-sm-2 mb-2 mb-sm-0" 
                style={{ marginRight: '10px'}} 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className='col-md-4'>
              <FormControl 
                type="text" 
                placeholder="Rechercher par adresse" 
                className="mr-sm-2" 
                style={{ marginRight: '10px'}} 
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
            </div>
            <div className='col-md-4'>  
              <Button variant="outline-success" onClick={handleSearch}>Rechercher</Button>
            </div>
          </div>
        </Form>

      </div>
      <br></br>
      <div className="container mt-3" >
        <h2 className="text-center my-4">les Entreprises </h2>
        <div className="row">
          {societes && societes.map((societe, index) => (
            <div className="col-md-4" key={index}>
              <div className="card mb-4">
                {societe && societe.avatar ? (
                  <img src={`http://localhost:5000/${societe.avatar}`}  className="card-img-top" alt="Avatar" style={{ height: "250px" }} />
                ) : (
                  <img src={defaultAvatar} className="card-img-top" alt="Avatar par défaut" style={{ height: "250px" }} />
                )}

                <div className="card-body">
                  <h5 className="card-title">{societe.nom_societe}</h5>
                  <p className="card-text">Adresse: {societe.adresse}</p>
                  <p className="card-text">Poste: {societe.poste}</p>
              
                  <Link to={`/offres?societeId=${societe._id}`} className="btn btn-primary">Voir toutes les offres</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
