import FavoritePlan from "../models/favoritePlan.js";

// Get all favorite plans for a user
export async function getAllFavorites(req, res) {
  try {
    const favorites = await FavoritePlan.find({
      user: req.params.userId,
    }).populate("plats");
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Add a favorite plan
export async function addFavorite(req, res) {
  const { userId, plats, totalCalories } = req.body;

  const newPlanData = {
    user: userId,
    plats: JSON.parse(plats),
    totalCalories: totalCalories,
  };

  try {
    const newPlan = await FavoritePlan.create(newPlanData);
    res.status(200).json(newPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Remove a favorite plan
export function removeFavorite(req, res) {
  FavoritePlan.findByIdAndDelete(req.params.id)
    .then(async (deletedPlan) => {
      res.status(200).json(deletedPlan);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
