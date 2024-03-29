import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import recrutementlogo from '../auth/img/image6.png';
import profile from '../auth/img/images.png';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, LinearScale } from 'chart.js/auto';

Chart.register(LinearScale);

const Dashboard = () => {
  const [showOffres, setShowOffres] = useState(false);
  const [chartData, setChartData] = useState({ datasets: [] });

  const [societeId, setSocieteId] = useState(null);
  const [token, setToken] = useState(null);
  const chartRef = useRef();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedSocieteId = localStorage.getItem('societeId');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedSocieteId) {
      setSocieteId(storedSocieteId);
    }
  }, []);

  useEffect(() => {
    const fetchOffres = async (token) => {
      try {
        if (token && societeId) {
          const response = await axios.get(`http://localhost:5000/api/offre`, {
            params: { societe: societeId },
            headers: { Authorization: `Bearer ${token}` },
          });
    
          const offres = response.data.offres.map(offre => ({
            x: new Date(offre.dateExp).toDateString(),
            y: response.data.offres.filter(o => new Date(o.dateExp) <= new Date(offre.dateExp)).length,
          }));
          setChartData({
            labels: offres.map(offre => offre.x),
            datasets: [{
              label: 'Offres',
              data: offres.map(offre => ({ x: offre.x, y: offre.y })),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            }],
          });
          
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des offres :', error);
      }
    };
    
  
    fetchOffres(token);
  }, [token, societeId]);
  
  
  useEffect(() => {
    const fetchSocieteId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`http://localhost:5000/api/societe?id=${societeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSocieteId(response.data._id);
        }
      } catch (error) {
        console.error('Error fetching societe ID:', error);
      }
    };
    
  
    if (societeId !== null) {
      fetchSocieteId();
    }
  }, [societeId]);
  
  useEffect(() => {
    const chartInstance = chartRef.current;
  
    if (chartInstance) {
      if (chartData.datasets) {
        chartInstance.data = chartData;
        chartInstance.update();
      }
    }
  }, [chartData]);

  const handleLogout = () => {
    // Logout logic
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className='m-2'>
        <Navbar.Brand>
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
              <Image src={profile} roundedCircle style={{ width: '30px', height: '30px', marginRight: '10px' }} />
              Profil
            </Nav.Link>
            <NavDropdown title="Déconnexion" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light position-relative">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
                <span className="fs-5 d-none d-sm-inline">Dashboard Societe</span>
              </a>
              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu" role="navigation">
                <li className="nav-item">
                  <Link to="/" className="nav-link px-0">
                    <FontAwesomeIcon icon={faChartSimple} style={{ marginRight: '5px' }} />
                    <span className="d-none d-sm-inline m-2 px-0">Statistiques</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <FontAwesomeIcon icon={faAddressBook} style={{ color: "blue" }} />
                  <span className="nav-link d-none d-sm-inline px-3" onClick={() => setShowOffres(!showOffres)}>Offres</span>
                  {showOffres && (
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start ">
                      <li className="nav-item">
                        <button className="nav-link px-0">Consulter</button>
                      </li>
                      <li className="nav-item ">
                      <Link to="/addOffre" className="nav-link px-0">Ajouter</Link> 
                      </li>                      <li className="nav-item">
                        <button className="nav-link px-0">Modifier</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link px-0">Supprimer</button>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <button className="nav-link px-0 align-middle">
                    <span className="ms-1 d-none d-sm-inline">Orders</span>
                  </button>
                </li>
              </ul>
              <hr />
            </div>
          </div>
        
          <div className="col py-3">
            {chartData.datasets && chartData.datasets.length > 0 ? (
              <Line
                ref={chartRef}
                data={{
                  labels: chartData.labels,
                  datasets: chartData.datasets,
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
