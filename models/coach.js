import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const coachSchema = new Schema(
    {
        NomCoach: {
            type: Sting,
            required: true
        },
        PrénomCoach: {
            type: String,
            required: true
        },
        Disponible: {
            type: Boolean,
            required: true
        },
        Spécialité: {
            type:String,
         
        }
    },
    {
        timestamps: true
    }
);

export default model('Coach', coachSchema);
