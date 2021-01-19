const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const db = require('../../db');

exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        //console.log(email + ' ' + password);
        if (!email || !password) {
            return res.status(400).send({
                message: 'Favor de introducir un ID o Contraseña'
            });
        };

        db.query('SELECT * FROM empleado WHERE nombre_usuario = ?', [email], async (error, results) => {
            //console.log(rfcUpper);
            if (error) {
                console.log(error);
                return res.status(400).send(error);
            }
            
            // si el ID no existe o si la contraseña no es correcta...
            if (results.length < 1 || !(await bcryptjs.compare(password, results[0].contrasena))) {
                // 401 es estado para PROHIBIDO
                console.log('Usuario o contraseña incorrectos');
                return res.status(401).send({
                    error: 'Usuario o contraseña incorrectos'
                });
            } else {
                const id = results[0].id_empleado;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("Sesion iniciada para " + results[0].nombre_usuario);

                // Establece opciones de cookie
                const cookieOptions = {
                    expires: new Date(
                        // Convierte fecha expiracion en milisegundos multiplicando (24 hrs * 60 mins * 60 seg * 1000 ms)
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                const data =
                {
                    idToken: token,
                    expiresIn: 5 * 60 * 60,
                    localId: id,
                    userRole: results[0].tipo_permiso
                };
                console.log(data);
                // Activa cookie en navegador con nombre, token y opciones.
                res.cookie('jwt', token, cookieOptions);
                return res.status(200).send(data);
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}