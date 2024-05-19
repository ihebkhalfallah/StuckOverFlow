import { validationResult } from "express-validator";

import Reservation from "../models/reservation.js";
import Coach from "../models/coach.js";
import Seance from "../models/seance.js";  

export const create = async (req, res) => {
    try {
        const { coach, seance } = req.body;

        // Vérifiez que les IDs fournis sont valides
        if (!mongoose.Types.ObjectId.isValid(coach) || !mongoose.Types.ObjectId.isValid(seance)) {
            return res.status(400).json({ error: 'Invalid coach or seance ID' });
        }

        const coachFound = await Coach.findById(coach);
        if (!coachFound) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        const seanceFound = await Seance.findById(seance);
        if (!seanceFound) {
            return res.status(404).json({ error: 'Seance not found' });
        }

        const reservation = new Reservation({
            coach,
            seance
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// export async function create(coachId, seanceId) {
//         const coach = await Coach.findById(coachId);
//     if (!coach) {
//         throw new Error('Coach not found');
//     }
//     //validation disponibilité coach fl méthode réserver

//     const seance = await Seance.findById(seanceId);
//     if (!seance) {
//         throw new Error('Seance not found');
//     }

//     const reservation = new Reservation({
//         coach: coachId,
//         seance: seanceId
//     });

//     await reservation.save();
//     return reservation;
// };

export function getAll(req, res) {
    Reservation.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getById(req, res) {
    const id = req.params.id;
    Reservation.findById(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}


export function update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    Reservation.findByIdAndUpdate(id, req.body)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}   

export function deleteOne(req, res) {
    const id = req.params.id;
    Reservation.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}