const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuestionSchema = new mongoose.Schema({
  contenu: {
      type: String,
      required: true
  },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quizz' },
});
  
  const question = mongoose.model('question', QuestionSchema);

  module.exports = question;