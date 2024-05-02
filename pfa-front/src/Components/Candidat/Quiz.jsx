import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import Footer from './Footer';
import '../Candidat/style.css';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Questions');
        if (!response.data) {
          throw new Error('Les données du quiz sont invalides');
        }
        setQuizData(response.data);
        const initialSelectedAnswers = {};
        response.data.forEach(question => {
          initialSelectedAnswers[question._id] = null;
        });
        setSelectedAnswers(initialSelectedAnswers);
        console.log(response.data); // Log quizData here
      } catch (error) {
        console.error('Erreur lors de la récupération des données du quiz:', error);
      }
    };

    fetchQuizData();
  }, []);


  const handleAnswerSelection = (questionId, reponseId) => {
    setSelectedAnswers(prevState => ({
      ...prevState,
      [questionId]: reponseId,
    }));
    console.log(`Question ${questionId} - Selected answer: ${reponseId}`);
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      // No necesitas volver a obtener las preguntas aquí, ya que ya las tienes en quizData

      const reponseCorrecte = quizData.map(question => ({
        questionId: question._id,
        correctionReponse: question.reponses.find(reponse => reponse.correctionReponse)?.correctionReponse || '',
      }));

      const selectedResponses = Object.entries(selectedAnswers)
        .map(([questionId, reponseId]) => {
          const question = quizData.find(q => q._id === questionId);
          if (question) {
            const response = question.reponses.find(responseContainer => {
              return responseContainer.reponses.some(response => response._id === reponseId);
            });
            console.log('Question:', question);
            console.log('reponseId:', reponseId);

            console.log('response', response)
            if (response) {
              const selectedResponse = response.reponses.find(response => response._id === reponseId);
              return {
                questionId,
                reponseId: selectedResponse._id,
                reponse: selectedResponse.reponse,
              };

            } else {
              console.error("Réponse non trouvée pour la question:", questionId);
              return null;
            }
          } else {
            console.error("Question non trouvée avec l'ID:", questionId);
            return null;
          }
        })
        .filter(response => response !== null);


      console.log('reponseCorrecte', reponseCorrecte)

      console.log('selectedResponses', selectedResponses)
      const unansweredQuestions = quizData
        .filter(question => selectedAnswers[question._id] === null)
        .map(question => ({
          questionId: question._id,
          reponseId: null,
        }));

      const responsesToSubmit = [...selectedResponses, ...unansweredQuestions];

      try {
        const response = await axios.post(
          'http://localhost:5000/api/Quiz/ResCandidat',
          { reponses: responsesToSubmit },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Response:', response);
        // Further handling of the response
        setQuizCompleted(true);
        setShowModal(true);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
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
                  La société a reçu votre réponse. Consultez votre boîte email.
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
    <div>
    <NavBar />
    <div className="container quiz-container">
      <h1 className="text-center quiz-title">{quizData && quizData.length > 0 && quizData[0].titreQuiz}</h1>
      <div className="row justify-content-center">
        {quizData && quizData.map(question => (
          <div key={question._id} className="col-md-8 mb-4">
            <div className="card quiz-card">
              <div className="card-body">
                <h3 className="card-title question-title">{question.contenu}</h3>
                <ul className="list-group">
                  {question.reponses.map((rep, index) => (
                    <li key={rep._id} className="list-group-item">
                      {rep.reponses.map((response, idx) => (
                        <div key={response._id} className="form-check">
                          <input
                            type="radio"
                            id={`radio-${response._id}`}
                            name={`question-${question._id}`}
                            className="form-check-input"
                            value={response._id}
                            checked={selectedAnswers[question._id] === response._id}
                            onChange={() => handleAnswerSelection(question._id, response._id)}
                          />
                          <label className="form-check-label" htmlFor={`radio-${response._id}`}>
                            {response.reponse}
                          </label>
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <button className="btn btn-primary submit-btn" onClick={handleSubmitQuiz}>Soumettre</button>
      </div>
    </div>
    <div className="container-fluid mt-4">
      <Footer />
    </div>
  </div>
  
  );
};

export default Quiz;
