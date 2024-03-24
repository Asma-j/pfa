const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Utilisateur model
const utilisateurSchema = new Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  prenom: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['Admin', 'Candidat','Societe'], 
    default: 'Candidat'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
} , {timestamps:true});

// Create a Utilisateur model using the schema
const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

// Export the Utilisateur model
module.exports = Utilisateur;
