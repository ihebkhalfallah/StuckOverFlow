import Panier from '../models/panier.js';
import Produit from '../models/produit.js';
import nodemailer from 'nodemailer';

// Configurer nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'molka953@gmail.com',  // Remplacez par votre email
    pass: 'kwgc uyok uzyt ehaq' // Remplacez par votre mot de passe
  }
});

// Email statique
const staticEmail = 'molkagmar1@gmail.com';  // Remplacez par l'email du client

// Ajouter un produit au panier
export async function ajouterAuPanier(req, res) {
    const { userId, produitId, quantity } = req.body;

    try {
        // Recherche du produit dans la base de données pour obtenir son prix
        const produit = await Produit.findById(produitId);
        if (!produit) {
            return res.status(404).json({ success: false, message: 'Le produit spécifié n\'existe pas' });
        }

        // Obtenir le prix du produit
        const prix = produit.price;

        let panier = await Panier.findOne({ userId });
        if (panier) {
            // Si un panier existe déjà pour cet utilisateur, ajoute le produit au panier existant
            const produitIndex = panier.produits.findIndex(item => item.produitId.toString() === produitId.toString());
            if (produitIndex !== -1) {
                // Si le produit existe déjà dans le panier, met à jour la quantité
                panier.produits[produitIndex].quantity += quantity;
            } else {
                // Sinon, ajoute le nouveau produit au panier
                panier.produits.push({ produitId, quantity });
            }
            // Mettre à jour le totalPrice
            panier.totalPrice += quantity * prix;
            await panier.save();
        } else {
            // Si aucun panier n'existe pour cet utilisateur, crée un nouveau panier
            panier = await Panier.create({ userId, produits: [{ produitId, quantity }], totalPrice: quantity * prix });
        }
        res.status(200).json({ success: true, message: 'Produit ajouté au panier avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function retirerDuPanier(req, res) {
    const { userId, produitId, quantity } = req.body;

    try {
        let panier = await Panier.findOne({ userId }).populate('produits.produitId');

        if (!panier) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const produitIndex = panier.produits.findIndex(item => item.produitId._id.toString() === produitId);

        if (produitIndex === -1) {
            return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
        }

        const produit = await Produit.findById(produitId);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        const produitPrice = produit.price;

        if (panier.produits[produitIndex].quantity > quantity) {
            panier.produits[produitIndex].quantity -= quantity;
        } else {
            panier.produits.splice(produitIndex, 1);
        }

        panier.totalPrice -= produitPrice * quantity;

        if (panier.totalPrice < 0) {
            panier.totalPrice = 0; // Ensure totalPrice doesn't go below 0
        }

        await panier.save();
        res.status(200).json({ message: 'Produit retiré du panier avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Consulter le panier d'un utilisateur
export async function consulterPanier(req, res) {
    const userId = req.params.userId;

    try {
        // Trouver le panier de l'utilisateur avec les détails des produits
        const panier = await Panier.findOne({ userId }).populate('produits.produitId');
        res.status(200).json(panier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Supprimer le panier d'un utilisateur
export async function supprimerPanier(req, res) {
    const { userId } = req.params;

    try {
        const panier = await Panier.findOneAndDelete({ userId });
        if (panier) {
            res.status(200).json({ message: 'Panier supprimé avec succès' });
        } else {
            res.status(404).json({ message: 'Panier non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function validerPanier(req, res) {
    const { userId } = req.body;

    try {
        const panier = await Panier.findOne({ userId }).populate('produits.produitId');

        if (!panier) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        // Envoyer l'email de confirmation
        const mailOptions = {
            from: 'molka953@gmail.com',  // Utilisez staticEmail comme adresse de l'expéditeur
            to: 'molkagmar1@gmail.com',  // Remplacez par l'email du client
            subject: 'Commande validée',
            text: `Votre commande a été validée. Notre service client va vous contacter bientôt.`
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: error.message });
            } else {
                console.log('Email sent:', info.response);

                // Pour chaque produit dans le panier
                for (const item of panier.produits) {
                    try {
                        const produit = await Produit.findById(item.produitId);
                        if (!produit) {
                            console.error(`Produit non trouvé: ${item.produitId}`);
                            continue;
                        }

                        // Diminuer la quantité disponible du produit
                        await Produit.findByIdAndUpdate(item.produitId, { $inc: { quantity: -item.quantity } });

                        // Mettre à jour le statut d'achat du produit
                        produit.achetePar = userId;
                        produit.acheteLe = new Date();
                        
                        // Sauvegarder les modifications du produit
                        await produit.save();
                    } catch (error) {
                        console.error(`Erreur lors de la mise à jour du produit ${item.produitId}: ${error.message}`);
                    }
                }

                // Réinitialiser le panier de l'utilisateur
                panier.produits = [];
                panier.totalPrice = 0;
                await panier.save();

                res.status(200).json({ message: 'Commande validée et email envoyé avec succès' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}




