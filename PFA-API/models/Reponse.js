const mongoose = require('mongoose');

const ReponseSchema = new mongoose.Schema({
  reponse: {
    type: String,
    required: true
  },
  correctionReponse: {
    type: String,
    required: true
  },
  candidat: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
});

const Reponse = mongoose.model('Reponse', ReponseSchema);

module.exports = Reponse;
