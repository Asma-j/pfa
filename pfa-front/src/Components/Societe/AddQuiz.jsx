import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddQuiz = () => {
  const [titre, setTitre] = useState('');
  const [durée, setDurée] = useState('');
  const [offreId, setOffreId] = useState('');
  const [offres, setOffres] = useState([]);
  const [questions, setQuestions] = useState([{ contenu: '', reponses: [{ reponse: '', correctionReponse: '' }] }]);
  const [token, setToken] = useState('');
  const [correctionIndex, setCorrectionIndex] = useState(null); // Nouvelle state pour stocker l'index de la réponse correcte

  const handleCorrectionChange = (questionIndex, reponseIndex) => {
    setCorrectionIndex({ questionIndex, reponseIndex });
    // Mettre à jour la valeur de correctionReponse dans le state
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].reponses[reponseIndex].correctionReponse = true; // ou une autre valeur pour représenter la sélection de la réponse correcte
    setQuestions(updatedQuestions);
  };
  
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleReponseChange = (questionIndex, reponseIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].reponses[reponseIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { contenu: '', reponses: [{ reponse: '', correctionReponse: '' }] }]);
  };
  const addReponse = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].reponses.push({ reponse: '', correctionReponse: '' });
    setQuestions(updatedQuestions);
    if (correctionIndex === null) {
      setCorrectionIndex({ questionIndex, reponseIndex: updatedQuestions[questionIndex].reponses.length - 1 });
    }
  };
  
  useEffect(() => {
    const fetchOffres = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);

                const urlSocieteId = localStorage.getItem('societeId');
                const response = await axios.get(`http://localhost:5000/api/offre?societe=${urlSocieteId}`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                const offres = response.data.offres;
                setOffres(offres);
            }
        } catch (error) {
            console.error('Error fetching offres:', error);
        }
    };

    fetchOffres();
}, []);
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedQuestions = questions.map((question, questionIndex) => ({
        ...question,
        reponses: question.reponses.map((reponse, reponseIndex) => ({
          ...reponse,
          correctionReponse: (correctionIndex && correctionIndex.questionIndex === questionIndex && correctionIndex.reponseIndex === reponseIndex) ? reponse.reponse : ''
        }))
      }));
      const response = await fetch('http://localhost:5000/api/Quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ titre, durée, offreId, questions: updatedQuestions }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Erreur lors de la création du quiz:', error);
    }
  };
  


  return (
    <div className="container mt-5">
      <h2>Ajouter un quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="titre" className="form-label">Titre du quiz:</label>
              <input type="text" className="form-control" id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label htmlFor="durée" className="form-label">Durée du quiz (en minutes):</label>
              <input type="number" className="form-control" id="durée" value={durée} onChange={(e) => setDurée(e.target.value)} required />
            </div>

          <div className="mb-3">
              <label htmlFor="offre" className="form-label">Offre:</label>
              <select className="form-select" id="offre" value={offreId} onChange={(e) => setOffreId(e.target.value)} required>
  <option value="">Sélectionnez une offre</option>
  {offres.map(offre => (
    <option key={offre._id} value={offre._id}>{offre.titre}</option>
  ))}
</select>

            </div>

            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-3">
                <label htmlFor={`question-${questionIndex}`} className="form-label">Question {questionIndex + 1}:</label>
                <input
                  type="text"
                  className="form-control"
                  id={`question-${questionIndex}`}
                  value={question.contenu}
                  onChange={(e) => handleQuestionChange(questionIndex, 'contenu', e.target.value)}
                  required
                />

{question.reponses.map((reponse, reponseIndex) => (
  <div key={reponseIndex} className="mb-3">
    <label htmlFor={`reponse-${questionIndex}-${reponseIndex}`} className="form-label">Réponse {reponseIndex + 1}:</label>
    <input
      type="text"
      className="form-control"
      id={`reponse-${questionIndex}-${reponseIndex}`}
      value={reponse.reponse}
      onChange={(e) => handleReponseChange(questionIndex, reponseIndex, 'reponse', e.target.value)}
      required
    />
    <label htmlFor={`correction-${questionIndex}-${reponseIndex}`} className="form-label">
      Correction:
      <input
        type="radio"
        name={`correction-${questionIndex}`}
        checked={correctionIndex && correctionIndex.questionIndex === questionIndex && correctionIndex.reponseIndex === reponseIndex}
        onChange={() => handleCorrectionChange(questionIndex, reponseIndex)}
      />
    </label>
  </div>
))}
                <button type="button" className="btn btn-secondary" onClick={() => addReponse(questionIndex)}>Ajouter une réponse</button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addQuestion}>Ajouter une question</button>
          </div>
          <div className="col-md-6 d-flex align-items-end justify-content-end">
            <button type="submit" className="btn btn-primary">Créer le quiz</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQuiz;
