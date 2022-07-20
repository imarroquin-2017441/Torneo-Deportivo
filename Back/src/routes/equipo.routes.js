'use strict'

const express = require('express');
const equipoController = require('../controllers/equipo.controller');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.post('/saveEquipo', mdAuth.ensureAuth, equipoController.saveEquipo);
api.get('/getEquipos', mdAuth.ensureAuth, equipoController.getEquipos);
api.get('/getPuntajes/:id', mdAuth.ensureAuth, equipoController.getEquipoPuntos);
api.put('/updateEquipo/:id', mdAuth.ensureAuth, equipoController.updateEqui);
api.delete('/deleteEquipo/:id', mdAuth.ensureAuth, equipoController.deleteEquipo);

module.exports = api;