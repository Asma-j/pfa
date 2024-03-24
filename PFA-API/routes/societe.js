const express = require('express');
const router = express.Router();
const societeController = require('../controllers/societeController')
const upload = require('../middleware/upload')
// Create a new Utilisateur
router.get('/', societeController.index);

// Get all Utilisateurs
router.post('/show', societeController.show);

// Get a single Utilisateur by ID
router.post('/store', upload.single('avatar'),societeController.store);

// Update a Utilisateur by ID
router.put('/update', societeController.update);

// Delete a Utilisateur by ID
router.delete('/delete', societeController.destroy);

module.exports = router;
