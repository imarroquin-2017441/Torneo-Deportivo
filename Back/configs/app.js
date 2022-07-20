'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('../src/routes/user.routes');
const ligaRoutes = require('../src/routes/liga.routes');
const equiRoutes = require('../src/routes/equipo.routes');
const jorRoutes = require('../src/routes/jornadas.routes');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/user', userRoutes);
app.use('/liga', ligaRoutes);
app.use('/equipo', equiRoutes);
app.use('/jornadas', jorRoutes);

module.exports = app;