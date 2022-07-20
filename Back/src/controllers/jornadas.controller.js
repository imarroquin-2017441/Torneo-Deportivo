'use strict'

const Liga = require('../models/liga.model');
const Equi = require('../models/equipo.model');
const Jor = require('../models/jornadas.model');
const { validateData, checkPermission } = require('../utils/validate');

exports.saveJornada = async(req, res) => {
    try {
        const params = req.body;
        const data = {
            jornada: params.jornada,
            equipolocal: params.equipolocal,
            equipolocalGoles: params.equipolocalGoles,
            equipovisitante: params.equipovisitante,
            equipovisitanteGoles: params.equipovisitanteGoles,
            user: req.user.sub
        }
        const msg = await validateData(data);
        if(msg) return res.status(400).send(msg);
        const equiposLocales = await Equi.findOne({_id: data.equipolocal})
        if (!equiposLocales) return res.send({message: 'Equipo local no encontrado'});
        const equiposVisitantes= await Equi.findOne({_id: data.equipovisitante});
        if (!equiposVisitantes) return res.send({message: 'Equipo visitante no encontrado'});
        const ligas= await Liga.findOne({_id: equiposLocales.liga});
        if(!ligas) return res.send({message: 'Liga no encontrada'});
        if(data.equipolocal === data.equipovisitante) return res.status(400).send({message: 'Por favor, no colocar los mismos equipos'});
        if(equiposLocales.user.toString() !==  equiposVisitantes.user.toString()) return res.status(401).send({message: 'No tienes permiso para agregar resultados en equipos o ligas que no creaste'});
        const permission = await checkPermission(equiposLocales.user, data.user);
        if(permission == false) return res.status(401).send({message: 'No tienes permiso para usar estos equipos.'});
        if(equiposLocales.liga.toString() !=  equiposVisitantes.liga.toString()) return res.send({message: 'Estos equipos no se encuentran en la misma liga'});
        let equipos = await Equi.find({liga: equiposLocales.liga});
        let results = equipos.length -1;
        if(data.jornada > results) return res.send({message: `Solo puede tener ${results} jornadas de esta liga`});
        const numeroJornada = await Jor.findOne({$and:[
            {jornada: data.jornada},
            {liga: equiposLocales.liga}
        ]});
        if(numeroJornada){
            let buscardiaJornada = await Jor.findOne({jornada: data.jornada, $or:[
                {"equipos.equipolocal": data.equipolocal},
                {"equipos.equipolocal": data.equipovisitante},
                {"equipos.equipovisitante": data.equipolocal},
                {"equipos.equipovisitante": data.equipovisitante}
            ]});
            if(buscardiaJornada) return res.send({message: 'Algunos de los equipos ya han jugado en esta jornada'});
            let empujarJornada = await Jor.findOneAndUpdate(
                {$and:[ {jornada: data.jornada},
                    {liga: equiposLocales.liga}
                ]},
                {$push:
                    {equipos:{equipolocal: data.equipolocal, equipolocalGoles: data.equipolocalGoles, 
                            equipovisitante: data.equipovisitante, equipovisitanteGoles: data.equipovisitanteGoles}},
                liga: equiposLocales.liga},
                {new: true}
            )
            
            if(data.equipolocalGoles < data.equipovisitanteGoles){
                let visitantes = {
                    puntos: equiposVisitantes.puntos + 4,
                    golesAnotados: equiposVisitantes.golesAnotados + data.equipovisitanteGoles,
                    golesEncontra: equiposVisitantes.golesEncontra + data.equipolocalGoles,
                    }
                let visitanteActualizacion = await Equi.findOneAndUpdate({_id: data.equipovisitante}, visitantes,{new:true});
                let visitantesJuegos = await Jor.find({$or:[
                    {"equipos.equipovisitante": data.equipolocal},
                    {"equipos.equipovisitante": data.equipovisitante}
                ]});
                
                let visitantesDiferencias = {
                    golesdeDiferencia: visitanteActualizacion.golesAnotados - visitanteActualizacion.golesEncontra,
                    partidosJugados: visitantesJuegos.length
                }
                await Equi.findOneAndUpdate({_id: data.equipovisitante}, visitantesDiferencias);
                
                let local = {
                    golesAnotados: equiposLocales.golesAnotados + data.equipolocalGoles,
                    golesEncontra: equiposLocales.golesEncontra + data.equipovisitanteGoles,
                }
                let localActualizacion = await Equi.findOneAndUpdate({_id: data.equipolocal}, local, {new: true});
                let juegosLocales = await Jor.find({$or:[
                    {"equipos.equipolocal": data.equipolocal},
                    {"equipos.equipolocal": data.equipovisitante}
                ]});
                let diferenciaLocal = {
                    golesdeDiferencia: localActualizacion.golesAnotados - localActualizacion.golesEncontra,
                    partidosJugados: juegosLocales.length
                }
                await Equi.findOneAndUpdate({_id: data.equipolocal}, diferenciaLocal);
                return res.send({message: 'Nuevo resultado añadido a la jornada', empujarJornada});
            };
    
            if(data.equipolocalGoles === data.equipovisitanteGoles){
                let visitante = {
                    puntos: equiposVisitantes.puntos + 1,
                    golesAnotados: equiposVisitantes.golesAnotados + data.equipovisitanteGoles,
                    golesEncontra: equiposVisitantes.golesEncontra + data.equipolocalGoles,
                    }
                let visitanteActualizacion = await Equi.findOneAndUpdate({_id: data.visitorTeam}, visitante,{new:true});
                let juegosVisitantes = await Jor.find({$or:[
                    {"equipos.equipovisitante": data.equipolocal},
                    {"equipos.equipovisitante": data.equipovisitante}
                ]});
                
                let diferenciaVisitante = {
                    golesdeDiferencia: visitanteActualizacion.golesAnotados - visitanteActualizacion.golesEncontra,
                    partidosJugados: juegosVisitantes.length
                }
                await Equi.findOneAndUpdate({_id: data.equipovisitante}, diferenciaVisitante);
                
                let local = {
                    puntos: equiposLocales.puntos + 1,
                    golesAnotados: equiposLocales.golesAnotados + data.equipolocalGoles,
                    golesEncontra: equiposLocales.golesEncontra + data.equipovisitanteGoles,
                }
                let localActualizacion = await Equi.findOneAndUpdate({_id: data.equipolocal}, local, {new: true});
                let juegosLocales = await Jor.find({$or:[
                    {"equipos.equipolocal": data.equipolocal},
                    {"equipos.equipolocal": data.equipovisitante}
                ]});
                let diferenciaLocal = {
                    golesdeDiferencia: localActualizacion.golesAnotados - localActualizacion.golesEncontra,
                    partidosJugados: juegosLocales.length
                }
                await Equi.findOneAndUpdate({_id: data.equipolocal}, diferenciaLocal);
                return res.send({message: 'Nuevo resultado agregado', empujarJornada});
            };
    
            if(data.equipolocalGoles > data.equipovisitanteGoles){
                let local = {
                    puntos: equiposLocales.puntos + 4,
                    golesAnotados: equiposLocales.golesAnotados + data.equipolocalGoles,
                    golesEncontra: equiposLocales.golesEncontra + data.equipovisitanteGoles,
                    }
                let localActualizacion = await Equi.findOneAndUpdate({_id: data.equipolocal}, local,{new:true});
                let juegosLocales = await Jor.find({$or:[
                    {"equipos.equipolocal": data.equipolocal},
                    {"equipos.equipolocal": data.equipovisitante}
                ]});
                
                let diferenciaLocal = {
                    diferenciadeGoles: localActualizacion.golesAnotados - localActualizacion.golesEncontra,
                    partidosJugados: juegosLocales.length
                }
                await Equi.findOneAndUpdate({_id: data.equipolocal}, diferenciaLocal);
                
                let visitantes = {
                    golesAnotados: equiposVisitantes.golesAnotados + data.equipovisitanteGoles,
                    golesEncontra: equiposVisitantes.golesEncontra + data.equipolocalGoles,
                }
                let visitorActualizacion = await Equi.findOneAndUpdate({_id: data.equipovisitante}, visitantes, {new: true});
                let juegosVisitantes = await Jor.find({$or:[
                    {"equipos.equipovisitante": data.equipolocal},
                    {"equipos.equipovisitante": data.equipovisitante}
                ]});
                let diferenciaVisitante = {
                    diferenciadeGoles: visitorActualizacion.golesAnotados - visitorActualizacion.golesEncontra,
                    partidosJugados: juegosVisitantes.length
                }
                await Equi.findOneAndUpdate({_id: data.equipovisitante}, diferenciaVisitante);
                return res.send({message: 'Nuevo resultado añadido a la jornada del partido', empujarJornada});
            };
        }else{
            let diaJornada = new Jor({jornada: data.jornada, liga: equiposLocales.liga}); 
            await diaJornada.save();
            let buscardiaJornada = await Jor.findOne({jornada: data.jornada, $or:[
                {"equipos.equipolocal": data.equipolocal},
                {"equipos.equipolocal": data.equipovisitante},
                {"equipos.equipovisitante": data.equipolocal},
                {"equipos.equipovisitante": data.equipovisitante}
            ]});
            if(buscardiaJornada) return res.send({message: 'Algunos de los equipos ya han jugado en esta jornada'});
            let empujarJornada = await Jor.findOneAndUpdate(
                {$and:[ {jornada: data.jornada},
                    {liga: equiposLocales.liga}
                ]},
                {$push:
                    {equipos:{equipolocal: data.equipolocal, equipolocalGoles: data.equipolocalGoles, 
                            equipovisitante: data.equipovisitante, equipovisitanteGoles: data.equipovisitanteGoles}},
                liga: equiposLocales.liga},
                {new: true}
            )
            
            if(data.equipolocalGoles < data.equipovisitanteGoles){
                let visitantes = {
                    puntos: equiposVisitantes.puntos + 4,
                    golesAnotados: equiposVisitantes.golesAnotados + data.equipovisitanteGoles,
                    golesEncontra: equiposVisitantes.golesEncontra + data.equipolocalGoles,
                    }
                let visitanteActualizacion = await Equi.findOneAndUpdate({_id: data.equipovisitante}, visitantes,{new:true});
                let visitantesJuegos = await Jor.find({$or:[
                    {"equipos.equipovisitante": data.equipolocal},
                    {"equipos.equipovisitante": data.equipovisitante}
                ]});
                
                let visitantesDiferencias = {
                    golesdeDiferencia: visitanteActualizacion.golesAnotados - visitanteActualizacion.golesEncontra,
                    partidosJugados: visitantesJuegos.length
                }
                await Equi.findOneAndUpdate({_id: data.equipovisitante}, visitantesDiferencias);
                
                let local = {
                    golesAnotados: equiposLocales.golesAnotados + data.equipolocalGoles,
                    golesEncontra: equiposLocales.golesEncontra + data.equipovisitanteGoles,
                }
                let localActualizacion = await Equi.findOneAndUpdate({_id: data.equipolocal}, local, {new: true});
                let juegosLocales = await Jor.find({$or:[
                    {"equipos.equipolocal": data.equipolocal},
                    {"equipos.equipolocal": data.equipovisitante}
                ]});
                let diferenciaLocal = {
                    golesdeDiferencia: localActualizacion.golesAnotados - localActualizacion.golesEncontra,
                    partidosJugados: juegosLocales.length
                }
                await Equi.findOneAndUpdate({_id: data.equipolocal}, diferenciaLocal);
                return res.send({message: 'Nuevo resultado añadido a la jornada', empujarJornada});
            };
    
            if(data.equipolocalGoles === data.equipovisitanteGoles){
                let visitante = {
                    puntos: equiposVisitantes.puntos + 1,
                    golesAnotados: equiposVisitantes.golesAnotados + data.equipovisitanteGoles,
                    golesEncontra: equiposVisitantes.golesEncontra + data.equipolocalGoles,
                    }
                let visitanteActualizacion = await Equi.findOneAndUpdate({_id: data.equipovisitante}, visitante,{new:true});
                let juegosVisitantes = await Jor.find({$or:[
                    {"equipos.equipovisitante": data.equipolocal},
                    {"equipos.equipovisitante": data.equipovisitante}
                ]});
                
                let diferenciaVisitante = {
                    golesdeDiferencia: visitanteActualizacion.golesAnotados - visitanteActualizacion.golesEncontra,
                    partidosJugados: juegosVisitantes.length
                }
                await Equi.findOneAndUpdate({_id: data.equipovisitante}, diferenciaVisitante);
                
                let local = {
                    puntos: equiposLocales.puntos + 1,
                    golesAnotados: equiposLocales.golesAnotados + data.equipolocalGoles,
                    golesEncontra: equiposLocales.golesEncontra + data.equipovisitanteGoles,
                }
                let localActualizacion = await Equi.findOneAndUpdate({_id: data.equipolocal}, local, {new: true});
                let juegosLocales = await Jor.find({$or:[
                    {"equipos.equipolocal": data.equipolocal},
                    {"equipos.equipolocal": data.equipovisitante}
                ]});
                let diferenciaLocal = {
                    golesdeDiferencia: localActualizacion.golesAnotados - localActualizacion.golesEncontra,
                    partidosJugados: juegosLocales.length
                }
                await Equi.findOneAndUpdate({_id: data.equipolocal}, diferenciaLocal);
                return res.send({message: 'Nuevo resultado agregado', empujarJornada});
            };
    
            if(data.equipolocalGoles > data.equipovisitanteGoles){
                let local = {
                    puntos: equiposLocales.puntos + 4,
                    golesAnotados: equiposLocales.golesAnotados + data.equipolocalGoles,
                    golesEncontra: equiposLocales.golesEncontra + data.equipovisitanteGoles,
                    }
                let localActualizacion = await Equi.findOneAndUpdate({_id: data.equipolocal}, local,{new:true});
                let juegosLocales = await Jor.find({$or:[
                    {"equipos.equipolocal": data.equipolocal},
                    {"equipos.equipolocal": data.equipovisitante}
                ]});
                
                let diferenciaLocal = {
                    diferenciadeGoles: localActualizacion.golesAnotados - localActualizacion.golesEncontra,
                    partidosJugados: juegosLocales.length
                }
                await Equi.findOneAndUpdate({_id: data.equipolocal}, diferenciaLocal);
                
                let visitantes = {
                    golesAnotados: equiposVisitantes.golesAnotados + data.equipovisitanteGoles,
                    golesEncontra: equiposVisitantes.golesEncontra + data.equipolocalGoles,
                }
                let visitorActualizacion = await Equi.findOneAndUpdate({_id: data.equipovisitante}, visitantes, {new: true});
                let juegosVisitantes = await Jor.find({$or:[
                    {"equipos.equipovisitante": data.equipolocal},
                    {"equipos.equipovisitante": data.equipovisitante}
                ]});
                let diferenciaVisitante = {
                    diferenciadeGoles: visitorActualizacion.golesAnotados - visitorActualizacion.golesEncontra,
                    partidosJugados: juegosVisitantes.length
                }
                await Equi.findOneAndUpdate({_id: data.equipovisitante}, diferenciaVisitante);
                return res.send({message: 'Nuevo resultado añadido a la jornada del partido', empujarJornada});
            };
        } 
    } catch (err) {
        console.error(err);
        return res.status(500).send({err, message: 'Error al agregar puntos'});
    }
}

exports.getJornadas = async (req, res)=>{
    try{
        const jornadas = await Jor.find()
        .sort({jornada: 1})
        .lean();
        return res.send({message: 'Jornadas: ', jornadas});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error obteniendo la Liga'});
    }
}