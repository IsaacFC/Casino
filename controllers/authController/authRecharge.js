const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const db = require('../../db');



exports.rechargeCardCash = async (req, res) => {

    try {
        const {
            casinoCard, amount
        } = req.body;
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT * FROM cliente WHERE no_tarjeta_casino = ?', [casinoCard], (error, cliente) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (modificar): ' + error
                });
            };
            if (cliente.length < 1) {
                console.log('Tajeta casino no existe');
                return res.status(400).send({
                    message: 'No existe la tarjeta casino #' + casinoCard
                });
            }
            var id = cliente[0].id_cliente;

            db.query('SELECT * FROM tarjeta WHERE id_tarjeta = ? AND id_cliente = ?', [casinoCard, id], (error, tarjeta) => {
                var saldoActual = tarjeta[0].saldo;
                var saldoNuevo = Number(saldoActual) + Number(amount);

                db.query('UPDATE tarjeta SET saldo = ? WHERE id_cliente = ?',
                    [saldoNuevo, id], async (error, results) => {

                        if (error) {
                            console.log(error);

                        } else {
                            console.log('Saldo actualizado ');
                            //return res.send(results);

                        };

                        db.query('INSERT INTO venta SET ?', {
                            no_caja: 3,
                            fecha: new Date(),
                            monto: amount,
                            id_empleado: decoded.id,
                            id_cliente: id,
                        }, (error, results) => {
                            if (error) {
                                console.log(error);
                                if (error.errno === 1062) {
                                    return res.status(409).send({
                                        message: 'El numero de tarjeta ya existe'
                                    });
                                }
                            } else {
                                console.log('Venta realizada');
                                return res.status(200).send({
                                    message: 'Venta realizada'
                                });
                            };
                        });
                    });
            });

        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al pagar con efectivo. \nError: ' + error
        });
    }
}


exports.rechargeCardCredit = async (req, res) => {

    try {
        const {
            casinoCard, Amount, TransactionId, Status, AccountId, LastFourDigits,
            creationDate
        } = req.body;
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT * FROM cliente WHERE no_tarjeta_casino = ?', [casinoCard], (error, cliente) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (modificar): ' + error
                });
            };
            if (cliente.length < 1) {
                console.log('Tajeta casino no existe');
                return res.status(400).send({
                    message: 'No existe la tarjeta casino #' + casinoCard
                });
            }
            var id = cliente[0].id_cliente;

            db.query('SELECT * FROM tarjeta WHERE id_tarjeta = ? AND id_cliente = ?', [casinoCard, id], (error, tarjeta) => {
                var saldoActual = tarjeta[0].saldo;
                var saldoNuevo = Number(saldoActual) + Number(amount);


                db.query('UPDATE tarjeta SET saldo = ? WHERE id_cliente = ?',
                    [saldoNuevo, id], async (error, results) => {

                        if (error) {
                            console.log(error);

                        } else {
                            console.log('Saldo actualizado ');
                            //return res.send(results);

                        };

                        db.query('INSERT INTO venta SET ?', {
                            no_caja: 3,
                            fecha: creationDate,
                            monto: amount,
                            no_trans_banco: transactionId,
                            id_empleado: decoded.id,
                            id_cliente: id,

                        }, (error, results) => {
                            if (error) {
                                console.log(error);
                                if (error.errno === 1062) {
                                    return res.status(409).send({
                                        message: 'El numero de tarjeta ya existe'
                                    });
                                }
                            } else {
                                console.log('Venta realizada');
                                return res.status(200).send({
                                    message: 'Venta realizada'
                                });
                            };
                        });
                    });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al pagar con tarjeta de crédito. \nError: ' + error
        });
    }
}

exports.rechargeCardHotel = async (req, res) => {

    try {
        const {
            casinoCard, amount, id_habitacion, nombre_servicio, costo_consumo, fecha
        } = req.body;
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT * FROM cliente WHERE no_tarjeta_casino = ?', [casinoCard], (error, cliente) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (modificar): ' + error
                });
            };
            if (cliente.length < 1) {
                console.log('Tajeta casino no existe');
                return res.status(400).send({
                    message: 'No existe la tarjeta casino #' + casinoCard
                });
            }
            var id = cliente[0].id_cliente;

            db.query('SELECT * FROM tarjeta WHERE id_tarjeta = ? AND id_cliente = ?', [casinoCard, id], (error, tarjeta) => {
                var saldoActual = tarjeta[0].saldo;
                var saldoNuevo = Number(saldoActual) + Number(amount);


                db.query('UPDATE tarjeta SET saldo = ? WHERE id_cliente = ?',
                    [saldoNuevo, id], async (error, results) => {

                        if (error) {
                            console.log(error);

                        } else {
                            console.log('Saldo actualizado ');
                            //return res.send(results);

                        };

                        db.query('INSERT INTO venta SET ?', {
                            no_caja: 3,
                            fecha: creationDate,
                            monto: costo_consumo,
                            no_trans_hotel: id_habitacion + nombre_servicio + fecha,
                            id_empleado: decoded.id,
                            id_cliente: id,

                        }, (error, results) => {
                            if (error) {
                                console.log(error);
                                if (error.errno === 1062) {
                                    return res.status(409).send({
                                        message: 'El numero de tarjeta ya existe'
                                    });
                                }
                            } else {
                                console.log('Venta realizada');
                                return res.status(200).send({
                                    message: 'Venta realizada'
                                });
                            };
                        });
                    });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al realizar cargo a la cuenta de Hotel. \nError: ' + error
        });
    }
}