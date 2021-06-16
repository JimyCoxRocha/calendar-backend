const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    collection: "usuarios"//Para quitar la "s" que coloca automaticamente
}
);

module.exports = model( "Usuario", UsuarioSchema );