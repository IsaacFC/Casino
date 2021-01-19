const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const db = require('../../db');



exports.registerEmployee = async (req, res) => {
    try {
        //const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        const { userName, name, firstLastName, secondLastName, nss, rfc, userType } = req.body;
        var rfcUpper = rfc.toUpperCase();

        // encripta la contraseña con 8 rondas
        let contrasenaEncriptada = await bcryptjs.hash((userName + '@!'), 8);
        console.log(contrasenaEncriptada);


        db.query('INSERT INTO empleado SET ?', {
            nombre_usuario: userName,
            nombre_empleado: name,
            apellido_paterno: firstLastName,
            apellido_materno: secondLastName,
            rfc: rfc,
            nss: nss,
            tipo_permiso: userType,
            contrasena: contrasenaEncriptada
        }, (error, results) => {
            // si la llave primaria está en la BD... entonces despliega error
            if (error) {
                console.log(error);
                if (error.errno === 1062) {
                    return res.status(409).send({
                        message: 'El nombre de usuario \'' + userName + '\' ya existe'
                    });
                }
            } else {
                console.log('Usuario creado');
                return res.status(201).send('Usuario creado');
            }
        });



    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al registrar usuario. \nError: ' + error
        });
    }
}

exports.modifyEmployee = async (req, res) => {

    try {
        const id = req.params.id;
        const {
            userName, name, firstLastName, secondLastName, rfc, nss, userType
        } = req.body;

        console.log('MODIFICAR: ' + id);
        db.query('SELECT * FROM empleado WHERE rfc = ?', [rfc], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (modificar): ' + error
                });
            };
            console.log('Modificar: ' + userName);
            
                db.query('UPDATE empleado SET nombre_usuario = ?, ' +
                    'nombre_empleado = ?, ' +
                    'apellido_paterno = ?, ' +
                    'apellido_materno = ?, ' +
                    'rfc = ?, ' +
                    'nss = ?, ' +
                    'tipo_permiso = ? WHERE id_empleado = ?',
                    [userName, name, firstLastName, secondLastName, rfc, nss, userType, id], async (error, results) => {

                        if (error) {
                            console.log(error);
                            if (error.errno === 1451) {
                                console.log('Este usuario imparte o se ha inscrito a un curso. No se puede modificar su RFC.');
                                return res.status(409).send({
                                    message: 'Este usuario imparte o se ha inscrito a un curso. No se puede modificar su RFC.'
                                });
                            }
                        } else {
                            //console.log('Usuario modificado ');
                            //return res.send(results);
                            return res.status(200).send('Usuario modificado');

                        }
                    });
            

        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al modificar usuario. \nError: ' + error
        });
    }
}