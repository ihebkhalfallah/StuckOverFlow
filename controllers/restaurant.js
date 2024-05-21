import Plat from "../models/plat.js";
import Restaurant from "../models/restaurant.js";

export function getAllRestaurants(req, res) {
  Restaurant.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOneRestaurant(req, res) {
  Restaurant.create(req.body)
    .then((newRestaurant) => {
      res.status(200).json(newRestaurant);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getOneRestaurant(req, res) {
  Restaurant.findById(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function updateOneRestaurant(req, res) {
  let newRestaurant = {};
  newRestaurant = {
    nomRestaurant: req.body.nomRestaurant,
    locationRestaurant: req.body.locationRestaurant,
  };
  Restaurant.findByIdAndUpdate(req.params.id, newRestaurant)
    .then((doc1) => {
      Restaurant.findById(req.params.id)
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

export function deleteOneRestaurant(req, res) {
  Restaurant.findByIdAndDelete(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getPlatsByRestaurantId(req, res) {
  Plat.find({ idRestaurant: req.params.id })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
