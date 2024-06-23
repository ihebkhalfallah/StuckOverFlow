import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categorieSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model('Categorie', categorieSchema);
