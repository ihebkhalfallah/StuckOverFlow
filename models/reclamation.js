import { Schema, model } from "mongoose";

const reclamationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    etat: {
        type: Boolean,
        required: true,
        default:false,
    }, 
    status: {
        type: Boolean,
        required: true,
        default:true,

    }, 
    email: {
        type:String,
        required: true
    }, 
    numTelReclamation: {
        type:String,
        required: true
    }, 
    pieceJointe: {
        type: String,
    },
    typeReclamation: {
        type: Schema.Types.ObjectId,
        ref:'Service',
    },
    userReclamation: {
        type: Schema.Types.ObjectId,
        ref:'User',
    },
    
},
    {
        timestamps: true
    }
);

export default model("Reclamation", reclamationSchema);