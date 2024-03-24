const { response } = require('express');
const Societe = require('../models/Societe'); 
const path = require('path');

const index = (req, res, next) => {
  Societe.find()
    .then(response => {
      res.json({
        response
      });
    })
    .catch(errors => {
      res.json({
        message: 'error'
      });
    });
};

const show = (req, res, next) => {
  let societeID = req.body.societeID;
  Societe.findById(societeID)
    .then(response => {
      res.json({
        response
      });
    })
    .catch(errors => {
      res.json({
        message: 'error'
      });
    });
};

const store = (req, res, next) => {
  // Create a new instance of Societe using the data from the request
  const newSociete = new Societe({
    nom_societe: req.body.nom_societe, // Ensure that you're providing the value for nom_societe
    poste: req.body.poste, // Ensure that you're providing the value for poste
    email: req.body.email,
    password: req.body.password,
    adresse: req.body.adresse,
  });
  if (req.file) {
    newSociete.avatar = req.file.path;
  }

  newSociete.save()
    .then(savedSociete => {
      res.status(201).json({ societe: savedSociete });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
};

const update = async (req, res, next) => {
  try {
    const _id = req.body._id;
    const updatedData = {
      nom_societe: req.body.nom_societe,
      poste: req.body.poste,
      email: req.body.email,
      password: req.body.password,
      adresse: req.body.adresse,
    };

    const response = await Societe.findByIdAndUpdate(_id, { $set: updatedData }, { new: true });
    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const destroy = (req, res, next) => {
  let _id = req.body._id;
  Societe.findOneAndDelete({ _id: _id })
    .then(response => {
      res.json({
        response
      });
    })
    .catch(errors => {
      res.json({
        message: 'error'
      });
    });
};

module.exports = { index, show, store, update, destroy };
