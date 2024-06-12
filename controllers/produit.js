import { validationResult } from 'express-validator';
import Produit from '../models/produit.js';
import Categorie from '../models/categorie.js';
import Achat from '../models/achat.js'; 

export function getAll(req, res) {
    const { idCategorie, minPrice, avgPrice, maxPrice } = req.query;

    let filter = {};

    if (idCategorie) {
        filter.idCategorie = idCategorie;
    }
    if (minPrice) {
        filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (avgPrice) {
        filter.price = { ...filter.price, $eq: Number(avgPrice) };
    }
    if (maxPrice) {
        filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    Produit.find(filter)
        .populate('idCategorie', 'nom')
        .then(docs => {
            if (docs.length === 0) {
                return res.status(404).json({ message: 'No products found for the specified criteria' });
            }
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
}

export function addOnce(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newProduit = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        idCategorie: req.body.idCategorie,
        image: req.file ? `${req.protocol}://${req.get('host')}/img/${req.file.filename}` : undefined
    };

    Categorie.findById(req.body.idCategorie) 
        .then(categorie => {
            if (!categorie) {
                return res.status(400).json({ error: 'Invalid category ID' });
            }
            return Produit.create(newProduit);
        })
        .then(produit => res.status(200).json(produit))
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
}

export function getOnce(req, res) {
    Produit.findById(req.params.id)
        .populate('idCategorie', 'nom')
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
}

export function putOnce(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const updatedProduit = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        idCategorie: req.body.idCategorie,
        image: req.file ? `${req.protocol}://${req.get("host")}/img/${req.file.filename}` : undefined
    };

    Categorie.findById(req.body.idCategorie)
        .then(categorie => {
            if (!categorie) {
                return res.status(400).json({ error: 'Invalid category ID' });
            }
            return Produit.findByIdAndUpdate(req.params.id, updatedProduit, { new: true });
        })
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
}

export function deleteOnce(req, res) {
    Produit.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.status(200).json({ message: "Product deleted successfully", product: doc });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
}

export function getTopSellingProductInPeriod(req, res) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
    }

    Achat.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate)
                }
            }
        },
        { 
            $group: { 
                _id: "$idProduit", 
                totalVentes: { $sum: 1 } 
            } 
        },
        { 
            $sort: { totalVentes: -1 } 
        },
        { 
            $limit: 1 
        }
    ])
    .then(result => {
        if (result.length === 0) {
            return res.status(404).json({ message: "No sales found in the given period" });
        }
        const topProductId = result[0]._id;
        return Produit.findById(topProductId)
            .populate('idCategorie', 'nom')
            .then(product => {
                if (!product) {
                    return res.status(404).json({ error: "Product not found" });
                }
                res.status(200).json(product);
            });
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    });
}
