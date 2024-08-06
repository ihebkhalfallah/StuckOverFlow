import { validationResult } from "express-validator";
import Coach from "../models/coach.js";
import Seance from '../models/seance.js'; 
import schedule from 'node-schedule';

export function getAll(req, res) {
    Coach.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getOne(req, res) {
    const id = req.params.id;
    Coach.findById(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const coach = new Coach(req.body);
    coach
        .save()
        .then((doc) => {
            res.status(201).json(doc);
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
    const coach = new Coach(req.body);
    Coach.findByIdAndUpdate(id, coach)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function deleteOne(req, res) {
    const id = req.params.id;
    Coach.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}       


export async function checkDisponibilite(idCoach, dateEvent, heureDebutEvent, heureFinEvent) {
    try {
        const coach = await Coach.findById(idCoach);

        if (!coach) {
            throw new Error("Le coach spécifié n'existe pas.");
        }

        const date = new Date(dateEvent);
        const heureDebut = new Date(`${dateEvent}T${heureDebutEvent}`);
        const heureFin = new Date(`${dateEvent}T${heureFinEvent}`);

        const seance = await Seance.findOne({
            DateEvent: dateEvent,
            HeureDebutEvent: heureDebutEvent,
            HeureFinEvent: heureFinEvent,
            Coach : coach
        });

        if (seance) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        throw new Error("Erreur lors de la vérification de la disponibilité : " + error.message);
    }
}

export function ResetJob () { schedule.scheduleJob(' 19 * * *', () => {
    Coach.updateMany({}, { Disponible: true }).exec(); // Reset Disponibilite 
  })};
  
import User from "../modules/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { sendApprovalCode } from "../services/email.service.js";

const createCoach = async (req, res) => {
  const {
    firstName,
    lastName,
    nickName,
    birthDate,
    email,
    password,
    adresse,
    phoneNumber,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const approvalCode = crypto.randomBytes(3).toString("hex");
    const user = new User({
      firstName,
      lastName,
      nickName,
      birthDate,
      role: "COACH",
      email,
      password,
      adresse,
      phoneNumber,
      approvalCode,
      isApproved: false,
    });
    await user.save();

    await sendApprovalCode(email, approvalCode);

    res.status(201).json({
      message: "User created. Approval code sent to email.",
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getCoach = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Coach not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "COACH" });
    console.log("coaches :", coaches);

    if (!coaches || coaches.length === 0) {
      return res.status(404).json({ message: "Coaches not found" });
    }
    res.status(200).json({ results: coaches.length, coaches: coaches });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteCoach = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Coach not found" });
    }
    res
      .status(200)
      .send(`Coach ${user.firstName} ${user.lastName} has been deleted`);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateCoach = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const allowedUpdates = [
      "firstName",
      "lastName",
      "nickName",
      "birthDate",
      "adresse",
      "weight",
      "height",
    ];
    const actualUpdates = Object.keys(updates);
    const isValidOperation = actualUpdates.some((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const changePasswordCoach = async (req, res) => {
  const id = req.params.id;
  const newPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.findOneAndUpdate(
    { _id: id },
    { password: newPassword },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "Coach not found" });
  }
  res.status(200).json({
    response: `Coach ${user.firstName} ${user.lastName} password has been modified`,
  });
};

export {
  createCoach,
  getCoach,
  getAllCoaches,
  deleteCoach,
  updateCoach,
  changePasswordCoach,
};
