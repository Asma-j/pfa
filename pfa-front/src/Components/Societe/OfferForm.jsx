import React, { useState } from 'react';
import axios from 'axios';

const OfferForm = () => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    societe: '',
    dateExp: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formDataToSend = {
      titre: formData.titre,
      description: formData.description,
      societe: formData.societe,
      dateExp: formData.dateExp
    };
  
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.post('http://localhost:5000/api/offre', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      console.log('Success:', response);
  
    } catch (error) {
      console.error('Error adding offer:', error);
     
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="titre" className="form-label">Title</label>
        <input type="text" className="form-control" id="titre" name="titre" value={formData.titre} onChange={handleChange} placeholder="Enter title" />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description"></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="societe" className="form-label">Company</label>
        <input type="text" className="form-control" id="societe" name="societe" value={formData.societe} onChange={handleChange} placeholder="Enter company" />
      </div>
      <div className="mb-3">
        <label htmlFor="dateExp" className="form-label">Expiration Date</label>
        <input type="date" className="form-control" id="dateExp" name="dateExp" value={formData.dateExp} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">Add Offer</button>
    </form>
  );
};

export default OfferForm;
