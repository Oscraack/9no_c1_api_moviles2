const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uuid =  require('uuid')

const db = require("../lib/db.js")
const userMiddleware = require("../middleware/users.js")
const { validateRegister } = require('../middleware/users.js')

//  http://localhost:3000/api/sign-up
router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE nombre = ${req.body.nombre}`,
        (err, result) => {
            if (result && result.length) {
                console.log('resultado: '+result)
                //error
                return res.status(409).send({
                    message: "Este nombre de usuario ya está en uso",
                });
            } else {
                //nombre de usuario que no esta en uso
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(400).send({
                            message: err,
                        })
                    } else {
                        db.query(
                            `INSERT INTO users (nombre, correo, password) VALUES (${db.escape(req.body.nombre)}, ${db.escape(req.body.correo)}, ${db.escape(hash)});`,
                            (err, result) => {
                                if (err) {
                                    return res.status(400).send({
                                        message: err,
                                    });
                                }
                                return res.status(201).send({
                                    'status':'success',
                                    'message': 'Registrado...'
                                })
                            }
                        );
                    }
                });
            }
        }
    );
});

router.get('/mensaje', (req,res,next) => {
    res.send({
        message:'Hola practica balanceo no dio tiempoooooo'
    })
})

//  http://localhost:3000/api/login
router.post('/login', (req, res, next) => {
    // console.log("data",req.body['nombre']);
    db.query(
        `SELECT correo,password FROM users WHERE correo = ${db.escape(req.body['correo'])};`,
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    message: err,
                });
            }
            if (!result) {
                return res.status(400).send({
                    message: "nombre o usuario incorrecto",
                });
            }
            console.log('====================================');
            //console.log('query ',result[0]['password','&',req.body['password']]);
            // console.log('query ',result[0]['id']);
            console.log('====================================');
            bcrypt.compare(req.body['password'], result[0]['password'], (bErr, bResult) => {
                if (bErr) {
                    return res.status(400).send({
                        message: "nombre o usuario incorrecto ojoioih"
                    })
                }
                if (bResult) {//password match
                    const token = jwt.sign({nombre: result[0]['nombre'],/*, userId: result[0]['id']*/
                        },
                            'SECRETKEY',
                            { expiresIn: "1d" }
                        );
                        // db.query(`UPDATE users SET last_login = now() WHERE id = ${result[0].id};`
                        // );
                        return res.status(200).send({
                            'status':'success',
                            'message': 'Logueado',
                            'token':token,
                            // user:result[0]
                        })
                    }
                    return res.status(401).send({
                        message: "nombre o contraseña incorrecta"
                    })
                }
            );
        }
    );
});

//  http://localhost:3000/api/secret-route
router.get('/secret-route', (req, res, next) => {

})

module.exports = router;