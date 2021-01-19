const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const db = require('../../db');



exports.registerCustomer = async (req, res) => {
    try {
        //const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        const { name, firstLastName, secondLastName, birthDate, citizenId, phoneNumber,
            address, email, casinoCard
        } = req.body;


        db.query('INSERT INTO cliente SET ?', {
            nombre_cliente: name,
            apellido_paterno: firstLastName,
            apellido_materno: secondLastName,
            fecha_nacimiento: birthDate,
            identificador_ciudadano: citizenId,
            telefono: phoneNumber,
            domicilio: address,
            email: email,
            no_tarjeta_casino: casinoCard,
        }, (error, results) => {
            // si la llave primaria está en la BD... entonces despliega error
            if (error) {
                console.log(error);
                if (error.errno === 1062) {
                    return res.status(409).send({
                        message: 'El numero de ciudadano ya existe'
                    });
                }
            } else {
                console.log('Usuario creado');
            }
            db.query('SELECT * FROM cliente WHERE identificador_ciudadano = ?', [citizenId], (error, cliente) => {

                var id = cliente[0].id_cliente;
                db.query('INSERT INTO tarjeta SET ?', {
                    id_tarjeta: casinoCard,
                    id_cliente: id,
                    saldo: 0
                }, (error, results) => {
                    if (error) {
                        console.log(error);
                        if (error.errno === 1062) {
                            return res.status(409).send({
                                message: 'El numero de tarjeta ya existe'
                            });
                        }
                    } else {
                        console.log('Tarjeta asignada');
                        return res.status(201).send('Usuario creado');
                    }


                });
            });

        });



    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al registrar usuario. \nError: ' + error
        });
    }
}

exports.modifyCustomer = async (req, res) => {

    try {
        const id = req.params.id;
        const {
            name, firstLastName, secondLastName, birthDate, citizenId, phoneNumber,
            address, email, casinoCard
        } = req.body;

        console.log('MODIFICAR: ' + id);
        db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (modificar): ' + error
                });
            };
            db.query('UPDATE cliente SET nombre_cliente = ?, ' +
                'apellido_paterno = ?, ' +
                'apellido_materno = ?, ' +
                'fecha_nacimiento = ?, ' +
                'identificador_ciudadano = ?, ' +
                'telefono = ?, ' +
                'domicilio = ?, ' +
                'email = ?, ' +
                'no_tarjeta_casino = ? WHERE id_cliente = ?',
                [name, firstLastName, secondLastName, birthDate, citizenId, phoneNumber, address, email, casinoCard, id], async (error, results) => {

                    if (error) {
                        console.log(error);
                        if (error.errno === 1062) {
                            return res.status(409).send({
                                message: 'El numero de ciudadano o tarjeta casino ya existe'
                            });
                        };
                    } else {
                        console.log('Cliente modificado ');
                        //return res.send(results);
                        return res.status(200).send('Cliente modificado');
                    };
                });


        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al modificar usuario. \nError: ' + error
        });
    }
}