import { validationResult } from "express-validator";
import Plat from "../models/plat.js";
import Restaurant from "../models/restaurant.js";

export function getAllPlats(req, res) {
  Plat.find({})
    .populate("restaurants")
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function addOnePlat(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let newPlatData = {
    nomPlat: req.body.nomPlat,
    prixPlat: req.body.prixPlat,
    cuisine: req.body.cuisine,
    calories: req.body.calories,
    categoriePlat: req.body.categoriePlat,
    restaurants: req.body.restaurants,
    imagePlat: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : `${req.protocol}://${req.get("host")}/img/imagePlatDefault.png`,
  };

  Plat.create(newPlatData)
    .then(async (newPlat) => {
      try {
        const restaurantUpdates = newPlat.restaurants.map((restaurantId) =>
          Restaurant.findByIdAndUpdate(restaurantId, {
            $addToSet: { plats: newPlat._id },
          })
        );
        await Promise.all(restaurantUpdates);
        res.status(200).json(newPlat);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getOnePlat(req, res) {
  Plat.findById(req.params.id)
    .populate("restaurants")
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ error: "Plat not found" });
      }
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function updateOnePlat(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  let updatedPlatData = {
    nomPlat: req.body.nomPlat,
    prixPlat: req.body.prixPlat,
    cuisine: req.body.cuisine,
    calories: req.body.calories,
    categoriePlat: req.body.categoriePlat,
    restaurants: req.body.restaurants,
    imagePlat: req.file
      ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
      : undefined,
  };

  Plat.findByIdAndUpdate(req.params.id, updatedPlatData, { new: true })
    .then(async (updatedPlat) => {
      try {
        const restaurantUpdates = updatedPlat.restaurants.map((restaurantId) =>
          Restaurant.findByIdAndUpdate(restaurantId, {
            $addToSet: { plats: updatedPlat._id },
          })
        );
        await Promise.all(restaurantUpdates);
        res.status(200).json(updatedPlat);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function deleteOnePlat(req, res) {
  Plat.findByIdAndDelete(req.params.id)
    .then(async (deletedPlat) => {
      try {
        const restaurantUpdates = deletedPlat.restaurants.map((restaurantId) =>
          Restaurant.findByIdAndUpdate(restaurantId, {
            $pull: { plats: deletedPlat._id },
          })
        );
        await Promise.all(restaurantUpdates);
        res.status(200).json(deletedPlat);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export async function findPlatsWithinCalories(req, res) {
  const { maxCalories, minCalories } = req.query;
  const max = parseInt(maxCalories);
  const min = parseInt(minCalories);
  try {
    const entrees = await Plat.find({ categoriePlat: "entree" });
    const platsPricipales = await Plat.find({
      categoriePlat: "plat principale",
    });
    const desserts = await Plat.find({ categoriePlat: "dessert" });
    const validCombinations = [];

    for (const entree of entrees) {
      for (const platPricipale of platsPricipales) {
        for (const dessert of desserts) {
          const totalCalories =
            entree.calories + platPricipale.calories + dessert.calories;
          if (totalCalories >= min && totalCalories <= max) {
            validCombinations.push({
              entree,
              platPricipale,
              dessert,
              totalCalories,
            });
          }
        }
      }
    }
    if (validCombinations.length === 0) {
      return res.status(404).json({
        error: "Aucun combinaison trouvé.",
      });
    }
    res.status(200).json(validCombinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
