/* 
    -------RUTA------
    Rutas de Eventos
    host + /api/events
*/
const express = require("express");
const router = express.Router();
const { validarJWT } = require( "../middlewares/validar-jwt" );
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require ("../controllers/events");
const { check } = require( "express-validator" );
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

//Para vvalidar a todas las peticiones. Todas las que esten abajo se les va a poner
//router.use( validarJWT );

//Todos tienen que pasar por la validación del jwt
//Obtener eventos
router.get( 
    "/", 
    [
        validarJWT 
    ],
    getEventos );

//Crear un nuevo evento
router.post( 
    "/", 
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("start", "La hora de inicio es obligatoria").custom( isDate ),//espera un callback paara el campo
        check("end", "La hora de finalización es obligatoria").custom( isDate ),
        validarCampos,
        validarJWT
    ], 
    crearEvento );

//actualizar eventos
/* router.put( 
    "/:id", 
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("start", "La hora de inicio es obligatoria").custom( isDate ),//espera un callback paara el campo
        check("end", "La hora de finalización es obligatoria").custom( isDate ),
        validarCampos,
        validarJWT
    ], 
    actualizarEvento ); */

router.put(
    '/:id', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos,
        validarJWT
    ],
    actualizarEvento 
);


//borrar eventos
router.delete( 
    "/:id", 
    [
        validarJWT
    ], 
    eliminarEvento );

module.exports = router;