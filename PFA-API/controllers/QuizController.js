const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Reponse = require('../models/Reponse');
const Utilisateur = require('../models/Utilisateur');
const ResponseCandidat = require('../models/ResponseCandidat');

exports.getAllQuizz = async (req, res) => {
  try {
    const quiz = await Quiz.find().populate('questions');
    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des quiz." });
  }
};
exports.getReponses = async (req, res) => {
    try {
      const reponses = await Reponse.find().populate('candidat');
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
        const newCandidature = await ResponseCandidat.create({ 
            reponse: reponseId, 
            candidat: candidatId, 
            taux 
        });
        
        res.status(201).json({ message: "Candidature créée avec succès.", newCandidature });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la candidature." });
    }
};



exports.createQuizz = async (req, res) => {
  const { titre, durée, questions } = req.body;
  try {
    const quiz = await Quiz.create({ titre, durée });
    if (questions && questions.length > 0) {
      const createdQuestions = await Question.insertMany(questions.map(q => ({ ...q, quiz: quiz._id })));
      quiz.questions = createdQuestions.map(q => q._id);
      await quiz.save();
    }
    res.status(201).json({ message: "Quiz créé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du quiz." });
  }
};

exports.createQuestion = async (req, res) => {
  const { contenu, reponses } = req.body;
  try {
    const question = await Question.create({ contenu });
    if (Array.isArray(reponses) && reponses.length > 0) {
      const createdReponses = await Reponse.insertMany(reponses.map(r => ({ ...r, question: question._id })));
      question.reponses = createdReponses.map(r => r._id);
      await question.save();
    }
    res.status(201).json({ message: "Question créée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la question." });
  }
};


exports.getQuestions = async (req, res) => {
  try {
      const questions = await Question.find().populate('Reponses'); // Utilisez 'Reponses' avec une majuscule, qui correspond au nom du chemin dans le schéma
      res.json(questions);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération des questions." });
  }
};



exports.createReponse = async (req, res) => {
    const { reponse, correctionReponse, candidatId } = req.body;
    try {
      

        // Vérifiez d'abord si l'utilisateur existe
        const candidat = await Utilisateur.findOne({ _id: candidatId });
        if (!candidat) {
        
            return res.status(400).json({ message: "Utilisateur invalide." });
        }

        // Vérifiez si l'utilisateur a le rôle de candidat
        if (candidat.role !== 'Candidat') {
            console.log("L'utilisateur n'a pas le rôle de candidat:", candidat);
            return res.status(400).json({ message: "L'utilisateur n'est pas un candidat." });
        }
  
        // Créez la réponse avec l'ID de l'utilisateur associé
        const newReponse = await Reponse.create({ reponse, correctionReponse, candidat: candidatId });
  
        res.status(201).json({ message: "Réponse créée avec succès.", newReponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la réponse." });
    }
};
