'use strict'

const mongoose = require('mongoose');

exports.init = ()=>{
    const uriMongo = 'mongodb://127.0.0.1:27017/TorneoDeportivo';
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', ()=>{
        console.log('MongoDB | No se pudo conectar a MongoDB');
        mongoose.disconnect();
    });
    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDB | probando conexion');
    });
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB | conectado a mongodb');
    });
    mongoose.connection.once('open', ()=>{
        console.log('MongoDB | conectado a la database');
    });
   mongoose.connection.on('reconnected', ()=>{
       console.log('MongoDB | reconectando a mongodb');
   });
   mongoose.connection.on('disconnected', ()=>{
       console.log('MongoDB | desconectado');
   });

   mongoose.connect(uriMongo, {
    maxPoolSize: 50,
    useNewUrlParser: true,
    connectTimeoutMS: 2500,
    }).catch(err=>console.log(err));
}