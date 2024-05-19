import mongoose from 'mongoose';

import Coach from './coach.js';
const { Schema, model } = mongoose;



const seanceSchema = new Schema(
    {
        TypeEvent: {
            type: [{
                type: String,
                enum: ['PRIVATECOURSE', 'DANCECOURSE', 'BODYCOMBATCOURSE','SPINNINGCOURSE']
            }],
            required: true
        },
        IdSalleDeSport: {
            type: Number,
           required: true
        },
        DateEvent: {
            type: String,
            required: true
        },
        NbrParticipant: {
            type: Number,
            required: true
        },
        Capacity: {
            type: Number,
            required: true
        },
        HeureDebutEvent: {
            type: Date, 
            //time??
            required: true
        },
        HeureFinEvent: {
            type: Date, //time??
           required: true
        },
        // NomCoach: {
        //     type: String, //autre facon de faire?
        //     //required: true
        // },
        // PrénomCoach: {
        //     type: String,
        //     //required: true
        // },
        coach: {
            type: Schema.Types.ObjectId,
            ref: 'Coach',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model('Seance', seanceSchema);
