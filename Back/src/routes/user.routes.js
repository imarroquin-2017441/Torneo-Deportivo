'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated')

api.get('/prueba', userController.prueba);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.update);
api.delete('/delete/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.delete);
api.post('/saveUser', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.saveUser);
api.get('/users', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getUsers);

module.exports = api;