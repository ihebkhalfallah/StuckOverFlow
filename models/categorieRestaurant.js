import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorieRestaurantSchema = new Schema({
  libelle: {
    type: String,
    required: true,
  },
  imageCategorieRestaurant: {
    type: String,
    required: false,
  },
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  ],
});

export default model("CategorieRestaurant", categorieRestaurantSchema);
