import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const coachSchema = new Schema(
    {
        NomCoach: {
            type: String,
            required: true
        },
        PrénomCoach: {
            type: String,
            required: true
        },
        Disponible: {
            type: Boolean , //= true,
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