const mysql = require('mysql')

const conexion = mysql.createConnection({
    host    :   "localhost",
    user    :   "mobilesUser",
    database:   "login_node_jwt",
    password:   "oscar12345678"
})

conexion.connect();
module.exports = conexion