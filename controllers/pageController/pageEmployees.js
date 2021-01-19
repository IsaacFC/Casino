const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');
var moment = require('moment');


exports.getUsers = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        //db.query('SELECT tipo_usuario FROM usuario WHERE rfc = ?', [decoded.id], (error, result) => {
            //if (result[0].tipo_usuario === 'COORDINADOR') {
            db.query('SELECT * FROM empleado', (error, empleados) => {
                if (error) {
                    return res.status(500).send({
                        message: 'Error al consultar los usuarios (gestion de usuarios): ' + error
                    });
                };
                let resArray = [];
                var data = {};

                if (empleados.length < 1) {
                    console.log('Usuarios cargados');
                    return res.status(200).send(empleados);
                }
                Object.keys(empleados).forEach(function (key) {
                    var row = empleados[key];
                    data = {
                        id: row.id_empleado,
                        nombre_usuario: row.nombre_usuario,
                        name: row.nombre_empleado +
                            ' ' + row.apellido_paterno +
                            ' ' + row.apellido_materno,
                        rfc: row.rfc,
                        nss: row.nss,
                        userType: row.tipo_permiso,
                    };
                    resArray.push(data);

                    if ((empleados.length - 1) == key) {
                        console.log('Empleados cargados');
                        return res.status(200).send(resArray);
                    }
                });
            });
            //} else {
            // return res.status(401).send({
            //     message: 'Acceso denegado'
            // });
            //}
        //});
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener usuarios. \nError: ' + error
        });
    }
}


exports.getUserById = async (req, res) => {
    try {
        const id = req.params.Id;
        console.log(id);
        db.query('SELECT * FROM empleado WHERE id_empleado = ?', [id], (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar el usuario (obtener usuario): ' + error
                });
            };

            const data = {
                userName: result[0].nombre_usuario,
                name: result[0].nombre_empleado,
                firstLastName: result[0].apellido_paterno,
                secondLastName: result[0].apellido_materno,
                rfc: result[0].rfc,
                nss: result[0].nss,
                userType: result[0].tipo_permiso,
            };
            console.log(result[0].tipo_permiso)

            console.log('Usuario cargado con ID ' + req.params.rfc);
            return res.status(200).send(data);

        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener usuario. \nError: ' + error
        });
    }
}