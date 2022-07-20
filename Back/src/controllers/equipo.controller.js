'use strict'

const { validateData } = require("../utils/validate")
const Equi = require('../models/equipo.model');
const Liga = require('../models/liga.model');

exports.saveEquipo = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            puntos: 0,
            golesAnotados: 0,
            golesEncontra: 0,
            user: req.user.sub,
            liga: params.liga
        }
        const msg = validateData(data);
        
        if(msg) return res.status(400).send(msg);
        const ligaExist = await Liga.findOne({_id: params.liga});
        if(!ligaExist) return res.send({message: 'Liga no encontrada'});
        const equi = new Equi(data);
        await equi.save();
        return res.send({message: 'Equipo guardado'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error guardando equipo'})
    }
}

exports.getEquipos = async (req, res) =>{
    try{
        const equiUser = req.user.sub;
        const equipos = await Equi.find({user: equiUser})
        .lean()
        .populate('liga');
        if(!equipos) return res.send({message: 'Equipo no encontrado'});
        return res.send({equipos});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error obteniendo los equipos'});
    }
}

exports.getEquipoPuntos = async(req, res)=>{
    try{
        const equiUser = req.user.sub;
        const ligaEqui = req.params.id;
        const equipoLiga = await Liga.findOne({_id: ligaEqui});
        if(equipoLiga){
            const equipos = await Equi.find({user: equiUser})
            .sort({puntos: -1})
            .lean()
            .populate('liga');
            if(!equipos) return res.send({message: 'Equipo no encontrado'});
            return res.send({equipos});
        }else{
            return res.send({message: 'Ligas no encontrada'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error obteniendo resultados de equipos'});
    }
}

exports.updateEqui = async (req, res) =>{
    try{
        const equiId = req.params.id;
        const params = req.body;

        const ligaExist = await Liga.fondOne({_id: params.liga});
        if(!ligaExist) return res.send({message: 'Liga no encontrada'});
        const updateEqui = await Equi.findByIdAndUpdate({_id: equiId}, params, {new: true})
        .lean()
        .populate('liga');
        if(!updateEqui) return res.send({message: 'Equipo no existente o no actualizado'});
        return res.send({updateEqui, message: 'Equipo actualizado'})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error actualizando equipo'})
    }
}

exports.deleteEquipo = async (req, res)=>{
    try{
        const equiId = req.params.id;
        const equiDele = await Equi.findByIdAndDelete({_id: equiId})
        .lean()
        .populate('liga');
        if(equiDele) return res.send({equiDele, message: 'Equipo eliminado'});
        return res.send({message: 'Equipo no encontrado'})
    }catch(err){
        console.log(err);
        return err;
    }
}