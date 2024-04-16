const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  durée: {
    type: Number,
    required: true
  },
  Questions: {
    type: Schema.Types.ObjectId,
    ref: 'question' 
  },
});

const Quizz = mongoose.model('Quizz', QuizSchema);

module.exports = Quizz;
