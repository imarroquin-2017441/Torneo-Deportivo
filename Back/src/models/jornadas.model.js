'use strict'

const mongoose = require('mongoose');

const jornadasSchema = mongoose.Schema({
    jornada: Number,
    equipos: [
        {
            equipolocal:{type: mongoose.Schema.ObjectId, ref:'Equipo'},
            equipolocalGoles: Number,
            equipovisitante:{type: mongoose.Schema.ObjectId, ref:'Equipo'},
            equipovisitanteGoles: Number
        }
    ],
    liga : {type: mongoose.Schema.ObjectId, ref:' Liga'},
    user: {type: mongoose.Schema.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Jornadas', jornadasSchema);