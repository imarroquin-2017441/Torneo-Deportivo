'use strict'

const express = require('express');
const ligaController = require('../controllers/liga.controller');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.post('/saveLiga', mdAuth.ensureAuth, ligaController.saveLiga);
api.get('/getLigas', mdAuth.ensureAuth, ligaController.getLigas);
api.get('/getLiga', mdAuth.ensureAuth, ligaController.getLiga);
api.put('/updateLigas/:id', mdAuth.ensureAuth, ligaController.updateLiga);
api.delete('/deleteLiga/:id', mdAuth.ensureAuth, ligaController.deleteLiga);

module.exports = api;