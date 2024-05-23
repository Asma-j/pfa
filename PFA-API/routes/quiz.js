const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');
const upload = require('../middleware/upload')

router.get('/', QuizController.getAllQuizz);
router.get('/q', QuizController.getQuestions);
router.get('/r', QuizController.getReponses);
router.get('/rs', QuizController.getResponsesCandidat);
router.post('/Quiz', QuizController.createQuizz);
router.post('/ResCandidat', upload.single('cvUrl'),QuizController.createCandidature);
router.post('/Question', QuizController.createQuestion);
router.post('/Reponse', QuizController.createReponse);
router.post('/sendConfirmation', QuizController.sendConfirmation);

module.exports = router;