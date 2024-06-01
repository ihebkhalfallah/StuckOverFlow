import { validationResult } from "express-validator";
import ReclamationResponse from "../models/reclamationResponse.js";
let wss; // Define WebSocket server instance variable

export function setWebSocketServer(webSocketServer) {
    wss = webSocketServer; // Set the WebSocket server instance
}

export function getAllReclamationResponses(req, res) {
    ReclamationResponse.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getOneReclamationResponse(req, res) {
    const id = req.params.id;
    ReclamationResponse.findById(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function createReclamationResponse(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const reclamationResponse = new ReclamationResponse(req.body);
    reclamationResponse
        .save()
        .then((doc) => {
            ws.send(doc);
            res.status(201).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function updateReclamationResponse(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const reclamationResponse = req.body;
    ReclamationResponse.findByIdAndUpdate(id, reclamationResponse, { new: true })
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function deleteOneReclamationResponse(req, res) {
    const id = req.params.id;
    ReclamationResponse.findByIdAndDelete(id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}
