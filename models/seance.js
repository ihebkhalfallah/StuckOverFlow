import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const seanceSchema = new Schema(
    {
        TypeEvent: {
            type: [{
                type: String,
                enum: ['private course', 'dance course', 'body combat course','spinning course']
            }],
            required: true
        },
        IdSalleDeSport: {
            type: Number,
            required: true
        },
        DateEvent: {
            type: Date,
            required: true
        },
        NbrParticipant: {
            type: Number,
            required: true
        },
        HeureDebutEvent: {
            type: Date, //time??
            required: true
        },
        HeureFinEvent: {
            type: Date, //time??
            required: true
        },
        NomCoach: {
            type: Sting, //autre facon de faire?
            required: true
        },
        PrénomCoach: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export default model('Seance', seanceSchema);
