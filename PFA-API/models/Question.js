const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuestionSchema = new mongoose.Schema({
  contenu: {
      type: String,
      required: true
  },
  Reponses: [{
      type: Schema.Types.ObjectId,
      ref: 'Reponse'
  }]
});
  
  const question = mongoose.model('question', QuestionSchema);

  module.exports = question;