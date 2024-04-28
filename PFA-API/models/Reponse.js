const mongoose = require('mongoose');

const ReponseSchema = new mongoose.Schema({
  reponses: [
    {
      reponse: {
        type: String,
        required: true
      }
    }
  ],
  correctionReponse: {
    type: String,
    required: false,

  }
  ,
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'question' }
});

ReponseSchema.statics.findCorrectReponse = async function (questionId, reponseId, correctionReponseId) {
  return this.findOne({ question: questionId, correctionReponse: correctionReponseId, reponse: reponseId });
};

const Reponse = mongoose.model('Reponse', ReponseSchema);
module.exports = Reponse;
