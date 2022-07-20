'use strict';

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const jornadasController = require('../controllers/jornadas.controller');

api.post('/saveJornada',mdAuth.ensureAuth, jornadasController.saveJornada);
api.get('/getJornada', mdAuth.ensureAuth, jornadasController.getJornadas);

module.exports = api;