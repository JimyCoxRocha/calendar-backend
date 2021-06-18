//Para implementar el middlewere. OJO, por defecto recibe los valores de la función en el --> auth.js routes, 
const { response } = require( "express" );
const jwt = require( "jsonwebtoken" );

const validarJWT = ( req, res = response, next ) => {
    //Como voy a recibir el JWT (en este caso en los x-token Headers)
    const token = req.header("x-token");
    
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: "No hay token en la petición"
        })
    }

    try{
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        //Para que la request le llegue con los datos de uid en el "req" facilmente, este es un middlewere y debe pasarlo
        req.uid = uid;
        req.name = name;



    }catch( error ){
        return res.status(401).json({
            ok: false,
            msg: "Token no válido"
        });
    }
    
    // Si no colocamos validaciones en contra de la suplantación de firmas,
    //me puedo ir a https://jwt.io/ y firmar información para acceder
    //obviamente, el token retorna el uid, name, iat y exp en forma de JSON, pero
    //nada me impide entrar si tengo la firma y no valido nada


    next();

}

module.exports = {
    validarJWT
}