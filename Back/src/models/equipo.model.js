'use strict'

const mongoose = require('mongoose');

const equipoSchema = mongoose.Schema({
    name: String,
    puntos: Number,
    golesAnotados: Number,
    golesEncontra: Number,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    liga: {type: mongoose.Schema.ObjectId, ref: 'Liga'}
})

module.exports = mongoose.model('Equipo', equipoSchema);