import mongoose from "mongoose";
const { Schema, model } = mongoose;

const platSchema = new Schema({
  nomPlat: {
    type: String,
    required: true,
  },
  idRestaurant: {
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
});

export default model("Plat", platSchema);
