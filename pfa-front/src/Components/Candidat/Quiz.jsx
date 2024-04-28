import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false); // État pour contrôler l'affichage de la modal

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Questions');
        if (!response.data) {
          throw new Error('Les données du quiz sont invalides');
        }
        setQuizData(response.data);
        // Initialiser les réponses sélectionnées à null pour chaque question
        const initialSelectedAnswers = {};
        response.data.forEach(question => {
          initialSelectedAnswers[question._id] = null;
        });
        setSelectedAnswers(initialSelectedAnswers);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du quiz:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleAnswerSelection = (questionId, answerId) => {
    setSelectedAnswers(prevState => ({
      ...prevState,
      [questionId]: answerId,
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const Questions = await axios.get(`http://localhost:5000/api/Questions`);
      console.log('Questions',Questions)
      const correctionData = Questions.data.map(question => ({
        questionId: question._id,
        correctionReponse: question.reponses.find(reponse => reponse.correctionReponse === true)?.reponse || '' // Trouver la réponse correcte
      }));
      
      console.log('correctionData',correctionData)
      const selectedResponses = Object.entries(selectedAnswers)
      .filter(([_, reponseId]) => reponseId !== null)
      .map(([questionId, reponseId]) => {
        const correctionDataForQuestion = correctionData.find(data => data.questionId === questionId);
        return {
          questionId,
          reponseId,
          correctionReponseId: null, // Vous pouvez ajuster cela si nécessaire
          correctionReponse: correctionDataForQuestion.correctionReponse
        };
      });
        console.log('selectedResponses',selectedResponses)
      const unansweredQuestions = quizData
        .filter(question => selectedAnswers[question._id] === null)
        .map(question => ({ questionId: question._id, reponseId: null, correctionReponseId: question.correctionReponseId }));
        console.log('unansweredQuestions',unansweredQuestions)
      const response = await axios.post(
        'http://localhost:5000/api/Quiz/ResCandidat',
        { reponses: [...selectedResponses, ...unansweredQuestions] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data && response.data.taux !== undefined) {
        const taux = response.data.taux > 0 ? response.data.taux : 0;
        setScore(taux);
        setShowModal(true); // Afficher la modal si la soumission a réussi
        console.log('taux',taux)
      } else {
        console.error('Le taux de bonnes réponses est indéfini ou mal formaté dans la réponse.');
      }
  
      setQuizCompleted(true);
    } catch (error) {
      console.error('Erreur lors de la soumission du quiz:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  if (quizCompleted) {
    return (
      <div>
      {showModal && (
  <div className="modal fade show" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block" }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Reponse Envoyer</h5>
     
        </div>
        <div className="modal-body">
         la societe a reçoit votre reponse consulter votre boite email
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>
    
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    );
  }
  
  
  // Render quiz questions
  return (
    <div className="container">
      <h1 className="text-center mb-5">{quizData && quizData.length > 0 && quizData[0].titreQuiz}</h1>
      <div className="row justify-content-center">
        {quizData.map(question => (
          <div key={question._id} className="col-md-8 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{question.contenu}</h3>
                <ul className="list-group">
                  {question.reponses.map(reponse => (
                    <li key={reponse._id} className="list-group-item">
                      <label className="form-check">
                        <input
                          type="radio"
                          className="form-check-input me-2"
                          name={`question_${question._id}`}
                          value={reponse._id}
                          checked={selectedAnswers[question._id] === reponse._id}
                          onChange={() => handleAnswerSelection(question._id, reponse._id)}
                        />
                        {reponse.reponse}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
      <button className="btn btn-primary" onClick={handleSubmitQuiz} data-toggle="modal" data-target="#exampleModal">Soumettre</button>

      </div>
    </div>
  );
};

export default Quiz;
