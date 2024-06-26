import mongoose from "mongoose";
const { Schema, model } = mongoose;

const favoritePlanSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  plats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plat",
      required: true,
    },
  ],
  totalCalories: {
    type: Number,
    required: true,
  },
});

export default model("FavoritePlan", favoritePlanSchema);
