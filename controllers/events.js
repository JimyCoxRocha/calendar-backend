const { response } = require( "express" );
const Evento = require("../models/Evento");

const getEventos = async( req, res = response,  ) => {

    const eventos = await Evento.find({ "user": req.uid })
                                    .populate("user", "name");//Para llenar referencias Schema. Indico que solo quiero "name"
                    //NOTA: Los valors que se deben poner allí, son los del Schmea "Usuario"

    return res.status(200).json({
        ok: true,
        msg: eventos, 
    });
}

const crearEvento = async( req, res = response,  ) => {
    //Verificar que tenga el evento
    const evento = new Evento( { ...req.body, user:req.uid } );
    
    try{
        const eventoGuardado = await evento.save();
        return res.status(200).json({
            ok: true,
            eventoGuardado
        });
    }catch( error){
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador..."
        });
    }
    
}

const actualizarEvento = async( req, res = response,  ) => {

    const eventoID = req.params.id;

    try{
        const evento = await Evento.findById( eventoID );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe con ese ID"
            });
        }
        
        if( evento.user.toString() !== req.uid ){
            return res.status(401).json({
                ok: false,
                msg: "No tiene privilegios para editar este evento"
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid//Porque en la petición no viene el ID del usuario
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( 
                                            eventoID, 
                                            nuevoEvento, 
                                            { new: true /*Retorna los datos actualizados. Por defecto NO*/ } );

        return res.json({
            ok: true,
            evento: eventoActualizado
        });

    }catch (error){
        res.status(500).json({
            ok: false,
            msg: "hable con el administrador"
        });
    }

    
}

const eliminarEvento = async( req, res = response,  ) => {
    const eventoID = req.params.id;

    try{
        const evento = await Evento.findById( eventoID );
        
        /* Está mal dado, que allí en evento.user está el ID
        -----> console.log("El ID: ",evento.user.id);
        Me confundí porque pensé que debía acceder al desgloce que hice en getEventos con
        .populate("user", "name"), pero no era así. De por sí el user ya tiene el string predefinido */
        
        /* Verificar la existencia del elemnto
        (Debe estar primero porque me puede dar error en las validaciones) */
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe con ese ID"
            });
        }

        //Verificar si el usuario tiene permiso
        if( req.uid !== evento.user.toString() ){
            return res.status(401).json({
                ok: false,
                msg: "No tiene privilegios para editar este evento"
            });
        }
        


        await Evento.findByIdAndDelete( eventoID );

        return res.status(200).json({ok: true});

    }catch(error){
        return res.status(500).json({
            ok: false,
            msg: "hable con el administrador"
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}