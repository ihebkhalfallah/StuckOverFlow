import mongoose from "mongoose";
const { Schema, model } = mongoose;

const platSchema = new Schema({
  nomPlat: {
    type: String,
    required: true,
  },
  prixPlat: {
    type: Number,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  imagePlat: {
    type: String,
    required: false,
  },
  categoriePlat: {
    type: String,
    enum: ["entree", "plat principale", "dessert"],
  },
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  ],
});

export default model("Plat", platSchema);
