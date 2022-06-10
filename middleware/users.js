const req = require('express/lib/request');
const jwt = require('jsonwebtoken')

module.exports = {
    validateRegister: (req, res, next) => {
        //username 3 caracteres minimo
        // if(!req.body.username || !req.body.username.length < 3){
        //     return res.status(400).send({
        //         message:'Introduce un nombre de usuario con 3 caracteres mínimo'
        //     });
        // }
        if(!req.body.nombre){
            return res.status(400).send({
                message:'Lllena el campo'
            });
        }

        //password 6 caracteres minimo
        // if (!req.body.password || req.body.password.length < 6) {
        //     return res.status(400).send({
        //         message:'Introduce una contraseña con 6 caracteres como mínimo'
        //     });
        // }

        if (!req.body.password) {
            return res.status(400).send({
                message:'Introduce una contraseña'
            });
        }

        //password repetido
        // if (!req.body.password_repeat || req.body.password != req.body.password_repeat) {
        //     return res.status(400).send({
        //         message:'Ambos passwords deben coincidir'
        //     });
        // }
        next();
    },
    isLoggedIn: (req, res, next) => {
        try {
            const authHeader = req.headers.autorization;
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'SECRETKEY')
            req.userData = decoded;
            next();
        } catch (error) {
            return res.status(400).send({
                message:"Sesion no valida",
            })
        }
    },
};