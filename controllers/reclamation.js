    import Reclamation from '../models/reclamation.js';

    export function rateReclamationResponse(req, res) {
        const id = req.params.id;
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        Reclamation.findByIdAndUpdate(id, { rating }, { new: true })
            .then((doc) => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({ message: "Reclamation not found" });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    }

    export function getAllReclamations(req, res) {
        Reclamation.find({})
            .then((docs) => {
                res.status(200).json(docs);
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    }

    export function getOneReclamation(req, res) {
        const id = req.params.id;
        Reclamation.findById(id)
            .then((doc) => {
                res.status(200).json(doc);
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    }

    export function createReclamation(req, res) {
        const reclamation = new Reclamation(req.body);
      
        reclamation.save()
          .then((doc) => {
            res.status(201).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }

      export function updateReclamation(req, res) {
        const id = req.params.id;
        const updatedReclamation = req.body;
      
        Reclamation.findByIdAndUpdate(id, updatedReclamation, { new: true })
          .then((doc) => {
            if (doc) {
              io.emit('reclamationUpdated', { reclamationId: doc._id, clientId: doc.clientId });
              console.log(`Client with id ${doc.clientId} has been notified about the update to reclamation ${doc._id}`);
              res.status(200).json(doc);
            } else {
              res.status(404).json({ message: 'Reclamation not found' });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }
    export function deleteOneReclamation(req, res) {
        const id = req.params.id;
        Reclamation.findByIdAndDelete(id)
            .then((doc) => {
                res.status(200).json(doc);
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    }
