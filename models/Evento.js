const { Schema, model, SchemaType } = require("mongoose");

const EventoSchema = Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        //Indica que hará una referencia a un valor de la tabla, se debe colocar el name del Schema
        //Por ejemplo, Usuarios no es, ni usuarios. Dene ser Usuario que es el Schema en el código
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }
},
{
    collection: "eventos"//Para quitar la "s" que coloca automaticamente
}
);

//Solo para la presentación del JSON en las perticiones. En la DB se guarda igual __v y _id
EventoSchema.method("toJSON", function(){
    const { __v, _id, ...object } = this.toObject();
    object.v = __v;
    object.id = _id;
    return object;
});

module.exports = model( "Evento", EventoSchema );