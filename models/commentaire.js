
import { Schema, model } from "mongoose";

const commentaireSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    selection: {
        type: Boolean,
        required: true,
        default:false,
    }, 
    usercomment: {
        type: Schema.Types.ObjectId,
        ref:'User',
    },
    reclamationComment: {
        type: Schema.Types.ObjectId,
        ref:'Reclamation',
    },
},
    {
        timestamps: true
    }
);

export default model("Commentaire",commentaireSchema);