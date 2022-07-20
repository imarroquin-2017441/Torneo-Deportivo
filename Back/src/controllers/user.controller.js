'use strict'

const User = require('../models/user.model');
const { validateData, alreadyUser, 
    encrypt, checkPassword , checkPermission,
    checkUpdate} = require('../utils/validate');

const jwt = require('../services/jwt');

exports.prueba = async (req, res)=>{
    return res.send({message: 'Hola'});
}


exports.register = async (req, res)=>{
    try{
        const params = req.body;
        let data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: 'CLIENT'
        }
        let msg = validateData(data);

        if(!msg){
            let already = await alreadyUser(params.username);
            if(!already){
                data.phone = params.phone;
                data.password = await encrypt(params.password);
                
                let user = new User(data);
                await user.save();
                return res.status(201).send({message: 'Ususario creado exitosamente'});
            }else{
                return res.status(400).send({message: 'Ese nombre ya existe, prueba con otro'});
            }
        }else{
            return res.status(400).send(`${msg}`);
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error al guardar usuario'});
    }
}

exports.saveUser = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: params.role
        };

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const userExist = await alreadyUser(params.username);
        if(userExist) return res.send({message: 'Username ya existente en la base de datos'});
        if(params.role != 'ADMIN' && params.role != 'CLIENT') return res.status(400).send({message: 'rol invalido'});
        data.phone = params.phone;
        data.password = await encrypt(params.password);

        const user = new User(data);
        await user.save();
        return res.send({message: 'Usuario creado satisfactoriamente'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error guardando usuario'});
    }
}

exports.getUsers = async (req, res)=>{
    try{
        const users = await User.find();
        return res.send({users});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.login = async (req, res)=>{
    try{
        const params = req.body;
        let data = {
            username: params.username,
            password: params.password
        }

        let msg = validateData(data);

        if(!msg){
            let already = await alreadyUser(params.username);
            if(already && await checkPassword(params.password, already.password)){
                const token = await jwt.createToken(already);
                return res.send({already, message: 'Login completado', token});
            }else{
                return res.status(400).send({message: 'Username o password incorrectas'});
            }    
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.update = async (req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Actualizacion no autorizada en este usuario'});
        else {
            const notUpdated = await checkUpdate(params);
            if(notUpdated === false) return res.status(400).send({message: 'Los params solo se pueden actualizar por un admin'});
            const already = await alreadyUser(params.username);
            if(!already){
                const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new:true})
                .lean();
                return res.send({ userUpdated, message: 'Usuario actualizado'}); 
            }else {
                return res.send({message: 'Username ya utilizado'});
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.delete = async (req, res)=>{
    try{
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Accion no autorizada'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({userDeleted, message: 'Cuenta eliminada'});
        return res.send({message: 'Usuario no encontrado o ya eliminado'});
    }catch(err){
        console.log(err);
        return err;
    }
}