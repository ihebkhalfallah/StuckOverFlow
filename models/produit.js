import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const produitSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        idCategorie: {
            type: Schema.Types.ObjectId,
            ref: 'Categorie',
            required: true
        },
        salesCount: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

export default model('Produit', produitSchema);
