import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Reservation from "../models/reservation.js";
import Coach from "../models/coach.js";
import Seance from "../models/seance.js";  
import { checkDisponibilite } from "./ManageCoach.js";
import { sendEmail } from "../services/email.service.js";



export const create = async (req, res) => {
    try {
        const { coach, seance } = req.body;

        // Verif ID
        if (!mongoose.Types.ObjectId.isValid(coach) ) {
            return res.status(400).json({ error: 'Invalid coach ' });
        }

       if (!mongoose.Types.ObjectId.isValid(seance)){
            return res.status(400).json({ error: 'Invalid seance ' });
       }

        const coachFound = await Coach.findById(coach);
        if (!coachFound) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        const seanceFound = await Seance.findById(seance);
        if (!seanceFound) {
            return res.status(404).json({ error: 'Seance not found' });
        }

          // dispo
          const isDisponible = await checkDisponibilite(coach, seanceFound.DateEvent, seanceFound.HeureDebutEvent, seanceFound.HeureFinEvent);
          if (!isDisponible) {
              return res.status(400).json({ error: 'Coach not available' });
          }

        //nbr places

        if(seanceFound.NbrParticipant +1 > seanceFound.Capacity){
            return res.status(400).json({ error: 'Salle de sport full' });
        }   

        const reservation = new Reservation({
            coach,
            seance
        });

        // coachFound.Disponible = false; 
        seanceFound.NbrParticipant += 1;
       
        await coachFound.save();
        await seanceFound.save();

        await reservation.save();
        res.status(201).json(reservation , seanceFound, coachFound);
        
    
        sendEmail("rouissizouhour22@gmail.com", "Your Reservation is Successful", "Thank you for your reservation.");
        

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


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