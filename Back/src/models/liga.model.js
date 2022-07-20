'use strict'

const mongoose = require('mongoose');

const ligaSchema = mongoose.Schema({
    name: String,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Liga', ligaSchema);