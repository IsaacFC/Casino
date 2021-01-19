const jwt = require('jsonwebtoken');
const db = require('../../db');



exports.withdrawEarnings = async (req, res) => {

    try {
        const {
            casinoCard, amount
        } = req.body;
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT * FROM cliente WHERE no_tarjeta_casino = ?', [casinoCard], (error, cliente) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (retiro): ' + error
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
                if (saldoActual < amount) {
                var saldoNuevo = Number(saldoActual) - Number(amount);

                db.query('UPDATE tarjeta SET saldo = ? WHERE id_cliente = ?',
                    [saldoNuevo, id], async (error, results) => {

                        if (error) {
                            console.log(error);

                        } else {
                            console.log('Ganancias retiradas ');
                            //return res.send(results);

                        };

                        db.query('INSERT INTO retiro_ganancias SET ?', {
                            id_empleado: decoded.id,
                            id_cliente: id,
                            monto: amount,
                            fecha: new Date(),
                            no_caja: 3,
                        }, (error, results) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send({
                                    message: 'Error al registrar el retiro'
                                });
                                
                            } else {
                                console.log('Retiro realizado');
                                return res.status(200).send({
                                    message: 'Retiro realizado'
                                });
                            };
                        });
                    });
                } else {
                    return res.status(409).send({
                        message: 'La tarjeta casino no cuenta con saldo suficiente.'
                    });
                }
            });

        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al retirar ganancias. \nError: ' + error
        });
    }
}