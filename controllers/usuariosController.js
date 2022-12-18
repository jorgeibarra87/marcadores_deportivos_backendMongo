
exports.list = async (req, res) => {
    const todos = require('../models/' + req.params.table)
    try {
        const colUsuarios = await todos.find({})
        res.json(colUsuarios)
    } catch (error) {
        console.log(error)
        res.send(error)
        next()
    }

}

exports.add = async (req, res) => {
    const todos = require('../models/' + req.params.table)
    const todo = new todos(req.body)
    try {
        await todo.save()
        res.json(
            {
                message: 'nuevos ' + req.params.table + ' adicionado'
            }
        )
    } catch (error) {
        console.log(error)
        res.send(error)
        next()
    }

}

exports.show = async (req, res, next) => {
    const todos = require('../models/' + req.params.table)
    try {
        const usuario = await todos.findById(req.params.id)
        if (!usuario) {
            res.status(404).json({
                message: 'el ' + req.params.table + ' no existe'
            })
        }else res.json(usuario)
    } catch (error) {
        res.status(400).json({
            message: 'error al procesar la peticion'
        })
    }
}

exports.showUsuario = async (req, res,next) => {
    try {
        const todos = require('../models/' + req.params.table)
        const usuario1 = req.params.usuario
        const clave = req.params.clave
        const usuario = await todos.findOne({ usu_email: usuario1, usu_clave: clave })
        if (!usuario) {
            res.status(404).json({
                message: 'el ' + req.params.table + ' no existe'
            })
        }else res.json(usuario)
    } catch (error) {
        res.status(404).json({
            message: 'error al procesar la peticion'
        })
        
    }
}

exports.update = async (req, res, next) => {
    const todos = require('../models/' + req.params.table)
    try {
        const todo = await todos.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        )
        res.json(
            {
                message: req.params.table + ' actualizados'
            }
        )
    } catch (error) {
        res.status(400).json({
            message: 'error al procesar la peticion'
        })
    }
}

exports.delete = async (req, res) => {
    const todos = require('../models/' + req.params.table)
    const id = req.params.id
    try {
        await todos.findByIdAndDelete({ _id: id });
        res.json(
            {
                message: req.params.table + ' eliminado'
            }
        )
    } catch (error) {
        res.status(400).json({
            message: 'error al procesar la peticion'
        })
    }

}

exports.marcadoresInicial= async (req,res) =>{
    const todos = require('../models/marcadores')

    try{
        const colMarcadores = await todos.aggregate(
            [
                [
                    {
                        '$lookup': {
                            'from': 'equipos', 
                            'localField': 'equi_id', 
                            'foreignField': 'equi_id', 
                            'as': 'equipo1'
                        }
                    }, {
                        '$lookup': {
                            'from': 'equipos', 
                            'localField': 'equi_id2', 
                            'foreignField': 'equi_id', 
                            'as': 'equipo2'
                        }
                    }, {
                        '$lookup': {
                            'from': 'deportes', 
                            'localField': 'dep_id', 
                            'foreignField': 'dep_id', 
                            'as': 'deporte'
                        }
                    }, {
                        '$lookup': {
                            'from': 'usuarios', 
                            'localField': 'usu_id', 
                            'foreignField': 'usu_id', 
                            'as': 'usuario'
                        }
                    }, {
                        '$unwind': {
                            'path': '$equipo1'
                        }
                    }, {
                        '$unwind': {
                            'path': '$equipo2'
                        }
                    }, {
                        '$unwind': {
                            'path': '$deporte'
                        }
                    }, {
                        '$unwind': {
                            'path': '$usuario'
                        }
                    }, {
                        '$project': {
                            'fecha': '$mar_fechaEvento', 
                            'equi1': '$equipo1.equi_nombre', 
                            'equi2': '$equipo2.equi_nombre', 
                            'marca1': '$mar_marcadoresqui1', 
                            'marca2': '$mar_marcadoresqui2', 
                            'deporte': '$deporte.dep_nombre', 
                            'usuario': '$usuario.usu_nombres'
                        }
                    }, {
                        '$sort': {
                            'fecha': -1
                        }
                    }, {
                        '$limit': req.params.lim*1
                    }
                ]
            ]

        )
        res.json(colMarcadores)
    }catch (error){
        console.log(error)
        res.send(error)
    }

}
