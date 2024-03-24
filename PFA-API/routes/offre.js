const express = require('express');
const router = express.Router();
const offreController = require('../controllers/offreController');

// Routes for CRUD operations on Utilisateur model

// Create a new Utilisateur
router.get('/', offreController.index);

// Get all Utilisateurs
router.post('/show', offreController.show);

// Get a single Utilisateur by ID
router.post('/store', offreController.store);

// Update a Utilisateur by ID
router.put('/update', offreController.update);

// Delete a Utilisateur by ID
router.delete('/delete', offreController.destroy);

module.exports = router;
