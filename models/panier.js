import mongoose from 'mongoose';

const PanierProduitSchema = new mongoose.Schema({
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    quantity: { type: Number, default: 1 },
  //  prix: { type: Number, required: true }, // Prix du produit au moment de l'ajout au panier
});

const PanierSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    produits: [PanierProduitSchema], // Utilisation du schéma de produit pour chaque élément du panier
    totalPrice: { type: Number, required: true },
});

const Panier = mongoose.model('Panier', PanierSchema);

export default Panier;
