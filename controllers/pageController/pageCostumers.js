const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');
var moment = require('moment');


exports.getCostumers = async (req, res) => {
    try {
        db.query('SELECT * FROM cliente', (error, clientes) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar los cliebtes (gestion de clientes): ' + error
                });
            };
            let resArray = [];
            var data = {};

            if (clientes.length < 1) {
                console.log('Clientes cargados');
                return res.status(200).send(clientes);
            }
            Object.keys(clientes).forEach(function (key) {
                var row = clientes[key];
                data = {
                    id: row.id_cliente,
                    name: row.nombre_cliente +
                        ' ' + row.apellido_paterno +
                        ' ' + row.apellido_materno,
                    citizenId: row.identificador_ciudadano,
                    email: row.email,
                    phoneNumber: row.telefono
                };
                resArray.push(data);

                if ((clientes.length - 1) == key) {
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


exports.getCustomerById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id], (error, cliente) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar al cliente (obtener cliente): ' + error
                });
            };


            var data = {
                id: cliente[0].id_cliente,
                name: cliente[0].nombre_cliente,
                firstLastName: cliente[0].apellido_paterno,
                secondLastName: cliente[0].apellido_materno,
                birthDate: cliente[0].fecha_nacimiento,
                citizenId: cliente[0].identificador_ciudadano,
                phoneNumber: cliente[0].telefono,
                address: cliente[0].domicilio,
                email: cliente[0].email,
                casinoCard: cliente[0].no_tarjeta_casino,
            };

            console.log('Usuario cargado con ID ' + id);
            return res.status(200).send(data);

        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener usuario. \nError: ' + error
        });
    }
}