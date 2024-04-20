const mongoose = require('mongoose');

const ReponseSchema = new mongoose.Schema({
  reponse: {
    type: String,
    required: true
  },
  correctionReponse: {
    type: String,
    required:false
  },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'question' }
});

const Reponse = mongoose.model('Reponse', ReponseSchema);

module.exports = Reponse;
