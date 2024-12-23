const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Reponse = require('../models/Reponse');
const Utilisateur = require('../models/Utilisateur');
const ResponseCandidat = require('../models/ResponseCandidat');
const Offre = require('../models/Offre');
const sendNodemailer = require('../sendNodemailer');

exports.getAllQuizz = async (req, res) => {
  try {
    const quiz = await Quiz.find().populate('offre');
    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des quiz." });
  }
};
exports.getReponses = async (req, res) => {
    try {
      const reponses = await Reponse.find().populate('question');
      res.json(reponses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération des réponses." });
    }
  };
  exports.getResponsesCandidat = async (req, res) => {
    try {
        // Récupérer toutes les entrées ResponseCandidat et les peupler avec les données de Reponse et Utilisateur
        const responsesCandidat = await ResponseCandidat.find().populate('reponse').populate('candidat');

        res.json(responsesCandidat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des réponses candidat." });
    }
};

exports.createCandidature = async (req, res) => {
  const { reponseId, candidatId, taux } = req.body;
  
  try {
    // Créer une nouvelle candidature
    let newCandidature = new ResponseCandidat({ 
      reponse: reponseId, 
      candidat: candidatId, 
      taux 
    });

    if (req.file) {
      newCandidature.cvUrl = req.file.path;
    }

    newCandidature = await newCandidature.save();

    res.status(201).json({ responseCandidat: newCandidature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.sendConfirmation = async (req, res) => {
  const { email, taux } = req.body;

  try {
    if (taux > 60) {
      sendNodemailer(email, 'Confirmation', 'Félicitations, vous avez été accepté!');
      console.log(`Email de confirmation envoyé à ${email}`);
      res.status(200).send({ message: 'Email envoyé' });
    } else {
      console.log(`Le taux est inférieur à 60 pour ${email}`);
      res.status(400).send({ message: 'Le taux est inférieur à 60' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation :', error);
    res.status(500).send({ message: 'Erreur lors de l\'envoi de l\'email de confirmation' });
  }
};




exports.createQuizz = async (req, res) => {
  const { titre, durée, offreId } = req.body;
  try {
    // Vérifiez d'abord si l'offre associée au quiz existe
    const offre = await Offre.findOne({ _id: offreId });
    if (!offre) {
      return res.status(400).json({ message: "Offre invalide." });
    }

    // Créez le quiz avec le titre, la durée et l'ID de l'offre associée
    const newQuiz = await Quiz.create({ titre, durée, offre: offreId });

    res.status(201).json({ message: "Quiz créé avec succès.", newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du quiz." });
  }
};


exports.createQuestion = async (req, res) => {
  const { contenu, quizId } = req.body;
  try {

      const quiz = await Quiz.findOne({ _id: quizId });
      if (!quiz) {
          return res.status(400).json({ message: "Quiz invalide." });
      }

      // Créez la question avec l'ID du quiz associé
      const newQuestion = await Question.create({ contenu, quiz: quizId });

      res.status(201).json({ message: "Question créée avec succès.", newQuestion });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la création de la question." });
  }
};


exports.getQuestions = async (req, res) => {
  try {
      const questions = await Question.find().populate('quiz'); 
      res.json(questions);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération des questions." });
  }
};



exports.createReponse = async (req, res) => {
  const { reponse, correctionReponse, questionId } = req.body;
  try {
      // Vérifiez d'abord si l'utilisateur existe
      const question = await Question.findOne({ _id: questionId });
      if (!question) {
          return res.status(400).json({ message: "Question invalide." });
      }

      // Créez la réponse avec l'ID de la question associée
      let newReponse;
      if (correctionReponse !== undefined && correctionReponse !== '') {
          newReponse = await Reponse.create({ reponse, correctionReponse, question: questionId });
      } else {
          newReponse = await Reponse.create({ reponse, question: questionId });
      }

      res.status(201).json({ message: "Réponse créée avec succès.", newReponse });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la création de la réponse." });
  }
};
