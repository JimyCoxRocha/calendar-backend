const { response } = require("express");
const express = require( "express" );
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const Usuario = require("../models/Usuario");

const crearUsuario = async( req, res = response  ) => { //Al momento de ingresar aquí
    const { email, password } = req.body;
    try{
        let usuario = await Usuario.findOne({ email: email });//Busca el dato
        if( usuario !== null ){//Si el dato existe
            return res.status( 400 ).json({
                ok: false,
                msg: "Un usuario existe con ese correo"
            });
        }
        
        //Notación importante, Mongoose, genera el ID y lo guarda en usuario. Nos evita consultar en la BD
        usuario = new Usuario( req.body );//Ya sabe qu estructura tiene e ignorará el resto. Ver el Schema
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        //Generar JWT para autenticarlo inmediantamente cuando crea la contraseña
        const token = await generarJWT( usuario.id, usuario.name );

        
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        });
    }catch (error){
        return res.status(500).json({
            ok: false,
            msg: "Por favor, hable con el administrador"
        });
    }

}

const loginUsuario = async( req, res = response  ) => { //Al momento de ingresar aquí
    const { email, password } = req.body;
    

    try{
        const usuario = await Usuario.findOne({ email: email });//Busca el dato

        if( usuario === null ){//Si el dato no existe con ese correo
            return res.status( 400 ).json({
                ok: false,
                msg: "El usuario no existe con ese email"
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if( !validPassword ){ //Si el password no es el correcto
            return res.status(400).json({
                ok: false,
                msg: "Password incorrecto"
            });
        }

        //Generamos nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        });

    }catch (error){
        return res.status(500).json({
            ok: false,
            msg: "Por favor, hable con el administrador"
        });
    }
    
}

const revalidarToken = async ( req, res = response ) => { //Al momento de ingresar aquí
    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};