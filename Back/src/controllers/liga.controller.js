'use strict'

const { validateData } = require('../utils/validate');
const Liga = require('../models/liga.model');

exports.saveLiga = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            user: req.user.sub
        }
        const msg = validateData(data);
        if(!msg){
            const liga = new Liga(data);
            await liga.save();
            return res.send({message: 'Liga guardada'});
        }
        else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getLigas = async (req, res) =>{
    try{
        const ligaUser = req.user.sub;
        const ligas = await Liga.find({user: ligaUser});
        if(!ligas) return res.send({message: 'Liga no encontrada'});
        return res.send({ligas});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getLiga = async (req, res) =>{
    try {
        const ligaId = req.params.id;
        const liga = await Liga.findOne({_id: ligaId})
        return res.status(200).send({liga});

    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.updateLiga = async (req, res)=>{
    try{
        const ligaId = req.params.id;
        const params = req.body;
        const ligaExist = await Liga.findOne({_id: ligaId});
        if(!ligaExist) return res.status({message: 'Liga no encontrada'});
        const updateLi = await Liga.findByIdAndUpdate({_id: ligaId}, params, {new: true})
        .lean();
        if(!updateLi) return res.send({message: 'Liga no actualizada'});
        return res.send({updateLi, message: 'Liga actualizada'});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteLiga = async (req, res)=>{
    try{
        const ligaId = req.params.id;
        const ligaDele = await Liga.findOneAndDelete({_id: ligaId});
        if(ligaDele) return res.send({ligaDele, message: 'Liga eliminada'});
        return res.send({message: 'Liga no encontrada'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error eliminando la Liga'});
    }
}