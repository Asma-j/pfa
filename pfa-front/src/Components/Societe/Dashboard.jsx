import React, { useState, useEffect, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, LinearScale } from 'chart.js/auto';
import NavBar from '../NavBar';
import SideBar from '../SideBar';
Chart.register(LinearScale);

const Dashboard = () => {

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


  return (
    <>
   <NavBar/>
      <div className="container-fluid">
        <div className="row flex-nowrap">
         <SideBar/>
        
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
