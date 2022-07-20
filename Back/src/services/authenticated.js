'use strict'

const jwt = require('jwt-simple');
const secretKey = 'SecretKeyToExa';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'la solicitud no contiene la cabecera de autenticacion'})
    }else{
        try{
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretKey);
        }catch(err){
            console.log(err);
            return res.status(403).send({message: 'Token no valido o expirado'});
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = async (req, res, next)=>{
    try{
        const user = req.user;
        if(user.role === 'ADMIN') return next();
        return res.status(403).send({message: 'Usuario no autorizado'});
    }catch(err){
        console.log(err);
        return err;
    }
}