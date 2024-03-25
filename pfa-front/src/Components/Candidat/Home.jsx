import React, { useState, useEffect } from 'react';
import axios from 'axios';
import recrutementlogo from '../auth/img/image6.png'; 
import profile from '../auth/img/images.png'; 
import quiz from '../auth/img/image7.png';
import defaultAvatar from '../auth/img/images (1).png'; 
import { Navbar, Nav,NavDropdown,Image , Form, FormControl, Button } from 'react-bootstrap';
const Home = () => {
  const [societes, setSocietes] = useState(null); // Initialiser avec null
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/societe?name=${searchName}&address=${searchAddress}`);
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
  


  
  const handleLogout = () => {
    // Mettez ici votre logique de déconnexion
  };
  const handleSearch = () => {
    fetchData();
  };

  return (
    <div>
    
    <Navbar bg="light" expand="lg" className='m-2' >
        <Navbar.Brand  >
          <img
            src={recrutementlogo} 
            width="30"
            height="30"
            alt="EmploiAnalytique Logo"
            
          />
         <small> EmploiAnalytique</small>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Accueil</Nav.Link>
          </Nav>
          <Nav style={{ marginLeft: 'auto' }}>
  <Nav.Link href="#profile">
    <Image src={profile}  roundedCircle style={{ width: '30px', height: '30px', marginRight: '10px' }} />
    Profil
  </Nav.Link>
  <NavDropdown title="Déconnexion" id="basic-nav-dropdown">
    <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
  </NavDropdown>
</Nav>

        </Navbar.Collapse>
      </Navbar>
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
