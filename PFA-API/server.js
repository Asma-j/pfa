const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors'); // Importez le module CORS
const jwt = require('jsonwebtoken');
const Societe = require('./models/Societe');
const bcrypt = require('bcrypt');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const UtilisateurRoute = require('./routes/utilisateur');
const OffreRoute = require('./routes/offre');
const SocieteRoute = require('./routes/societe');
const Utilisateur = require('./models/Utilisateur');
const registerSocieteRoute = require('./routes/registerSociete');

mongoose.connect('mongodb://127.0.0.1:27017/gestionEmploi')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', (err) => {
  console.log(err);
});
db.once('open', () => {
  console.log('db connected');
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez CORS pour autoriser toutes les demandes provenant de localhost:3000
app.use(cors());

const router = express.Router(); // Define router here

// Set up port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  jwt.verify(token.split(' ')[1], 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    Utilisateur.findById(decoded.id)
      .then(user => {
        if (!user) {
          Societe.findById(decoded.id)
            .then(societe => {
              if (!societe) {
                return res.status(404).json({ message: 'User or company not found' });
              }
              req.societe = societe;
              next();
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ message: 'Internal server error' });
            });
        } else {
          req.user = user;
          next();
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });
};

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await Utilisateur.findOne({ email });
    let role = 'Utilisateur';

    if (!user) {
      user = await Societe.findOne({ email });
      role = 'Societe';
    }

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur ou société non trouvé' });
    }

    if (!password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).json({ token, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
app.get('/api/societe', (req, res) => {
  
  Societe.find()
    .then(societes => {
    
      res.json({ societes });
    })
    .catch(error => {
      // En cas d'erreur, renvoyer un message d'erreur
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.get('/user-role', verifyToken, (req, res) => {
  let role = 'Utilisateur';

  if (req.societe) {
    role = 'Societe';
  } else if (req.user) {
    role = 'Admin'; 
    role = 'Candidat'; 
  }

  res.json({ role });
});


app.post("/api/register", (req, res) => {
  Utilisateur.create(req.body)
    .then(utilisateur => res.json(utilisateur))
    .catch(err => res.json(err));
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});
app.post("/api/registerSociete", (req, res) => {
  Societe.create(req.body)
    .then(societe => res.json(societe))
    .catch(err => res.json(err));
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});



app.get("/getData", (req, res) => {
  res.send("Data from server");
});


app.use('/uploads',express.static('uploads'))
app.use('/api/utilisateur', UtilisateurRoute);
app.use('/api/offre', OffreRoute);
app.use('/api/societe', SocieteRoute);
app.use('/api/register', registerRoute);
app.use('/api/registerSociete', registerSocieteRoute);
app.use('/api/login', loginRoute);
app.use('/api', router); // Mount router here
