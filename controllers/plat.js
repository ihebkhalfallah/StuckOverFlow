import Plat from "../models/plat.js";

export function getAllPlats(req, res) {
  Plat.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOnePlat(req, res) {
  Plat.create(req.body)
    .then((newPlat) => {
      res.status(200).json(newPlat);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getOnePlat(req, res) {
  Plat.findById(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function updateOnePlat(req, res) {
  let newPlat = {};
  newPlat = {
    nomPlat: req.body.nomPlat,
    idRestaurant: req.body.idRestaurant,
    prixPlat: req.body.prixPlat,
    cuisine: req.body.cuisine,
  };
  Plat.findByIdAndUpdate(req.params.id, newPlat)
    .then((doc1) => {
      Plat.findById(req.params.id)
        .then((doc2) => {
          res.status(200).json(doc2);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteOnePlat(req, res) {
  Plat.findByIdAndDelete(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
