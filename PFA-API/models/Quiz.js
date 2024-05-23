const mongoose = require('mongoose');


const QuizSchema = new mongoose.Schema({
  titre: {
    type: String,
   

  },
  durée: {
    type: Number,
    required: true
  },
  offre: { type: mongoose.Schema.Types.ObjectId, ref: 'offre' },
});

const Quizz = mongoose.model('Quizz', QuizSchema);

module.exports = Quizz;
