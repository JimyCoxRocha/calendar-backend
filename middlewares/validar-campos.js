//Implementación de las validaciones que check se encarga de recoger en auth.js de routes, acá
//se implementa con -----> const errors = validationResult( req );

const { response } = require("express");
const { validationResult } = require("express-validator");


const validarCampos = ( req, res = response, next) => { //Con next se pasa el siguiente middleware
    //Manejo de errores
    const errors = validationResult( req );
    if( !errors.isEmpty() ){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
};