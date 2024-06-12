import Achat from "../models/achat.js";
import Produit from "../models/produit.js"; // Importe le modèle Produit
import User from "../models/user.js";

export function buyProduit(req, res) { // Renomme la fonction en buyProduit
  Produit.findById(req.params.idProduit) // Remplace findById avec idProduit
    .then((produit) => { // Remplace game par produit
      if (produit.quantity > 0) { // Remplace game par produit
        User.findById(req.params.idUser)
          .then((user) => {
            if (user.wallet >= produit.price) { // Remplace game par produit
              Achat.create({
                idUser: req.params.idUser,
                idProduit: req.params.idProduit, // Remplace idGame par idProduit
              })
                .then((achat) => {
                  Produit.findByIdAndUpdate(req.params.idProduit, { // Remplace findByIdAndUpdate avec idProduit
                    quantity: produit.quantity - 1, // Remplace game par produit
                  })
                    .then((doc1) => {
                      User.findByIdAndUpdate(req.params.idUser, {
                        wallet: user.wallet - produit.price, // Remplace game par produit
                      })
                        .then((doc2) => {
                          res.status(200).json(achat);
                        })
                        .catch((err) => {
                          res.status(500).json({ error: err });
                        });
                    })
                    .catch((err) => {
                      res.status(500).json({ error: err });
                    });
                })
                .catch((err) => {
                  res.status(500).json({ error: err });
                });
            } else {
              res.status(200).json({ message: "Not enough cash !" });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      } else {
        res.status(200).json({ message: "Produit not available !" }); // Remplace Game par Produit
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
