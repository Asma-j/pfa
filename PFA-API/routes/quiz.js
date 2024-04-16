const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');


router.get('/', QuizController.getAllQuizz);
router.get('/q', QuizController.getQuestions);
router.get('/r', QuizController.getReponses);
router.get('/rs', QuizController.getResponsesCandidat);
router.post('/Quiz', QuizController.createQuizz);
router.post('/ResCandidat', QuizController.createCandidature);
router.post('/Question', QuizController.createQuestion);
router.post('/Reponse', QuizController.createReponse);


module.exports = router;