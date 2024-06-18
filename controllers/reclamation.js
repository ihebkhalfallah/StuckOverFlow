
import { sendEmailReclamation } from '../middlewares/ReclamationEmail.js';
import Reclamation from '../models/reclamation.js';
import User from '../models/user.js';

export function getReclamations(req, res) {
    Reclamation.find({})
    .then(reclamations => {
        res.status(200).json(reclamations);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

export function addReclamation(req, res) {
    console.log(req.body);

    Reclamation.create({
        title: req.body.title,
        description: req.body.description,
        numTelReclamation: req.body.numTelReclamation,
        email: req.body.email,
        typeReclamation: req.body.typeReclamation,
        userReclamation: req.body.userReclamation,
        pieceJointe: `${req.protocol}://${req.get("host")}/doc/${req.file.filename}`,
      }).then((newReclamation) => {
        res.status(200).json(newReclamation);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
    
}
export function getReclamation(req, res) {
    Reclamation.findById(req.params.id)
    .then(reclamation => {
        res.status(200).json(reclamation);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}
export function deleteReclamation(req, res) {
    Reclamation.findByIdAndDelete(req.params.id)
    .then(reclamation => {
        res.status(200).json(reclamation);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}
export function updateReclamation(req, res) {
    Reclamation.findByIdAndUpdate(req.params.id,
        {
        title: req.body.title,
        description: req.body.description,
        numTelReclamation: req.body.numTelReclamation,
        email: req.body.email,
        typeReclamation: req.body.typeReclamation,
        userReclamation: req.body.userReclamation,
        }
        ,{new:true})
    .then(reclamation => {
        res.status(200).json(reclamation);
    })
    .catch(err => {
        res.status(500).json(err);
    });

}
export async function searchReclamation(req, res){
    try {
        const { key } = req.params;
        const searchKey = new RegExp(key, 'i'); // 'i' for case-insensitive

        const reclamations = await Reclamation.find({
            $or: [
                { title: searchKey },
                { description: searchKey },
                { email: searchKey },
                { numTelReclamation: searchKey },
            ]
        })

        res.status(200).json(reclamations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Traietement avancer Pou les Reclamation 
export function fermerReclamation(req, res) {
    Reclamation.findByIdAndUpdate(req.params.id,{status:false},{new:true})
    .then(reclamation => {
        res.status(200).json(reclamation);
    })
    .catch(err => {
        res.status(500).json(err);
    });

}
export function ouvrireReclamation(req, res) {
    Reclamation.findByIdAndUpdate(req.params.id,{status:true},{new:true})
    .then(reclamation => {
        res.status(200).json(reclamation);
    })
    .catch(err => {
        res.status(500).json(err);
    });

}
export function traiterReclamation(req, res) {
    Reclamation.findByIdAndUpdate(req.params.id,{etat:true},{new:true})
    .then(reclamation => {
        res.status(200).json(reclamation);
        User.findById(reclamation.userReclamation)
        .then(user => {
            sendEmailReclamation(reclamation,user)
        }).catch(err => {
            res.status(500).json(err);
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });

}


// Function to get monthly reclamation count and percentage
export async function getReclamationStats(req, res) {
    try {
        const reclamations = await Reclamation.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: "$_id",
                    count: 1,
                    percentage: { $multiply: [{ $divide: ["$count", { $sum: "$count" }] }, 100] }
                }
            }
        ]);

        const services = await Reclamation.aggregate([
            {
                $group: {
                    _id: "$typeReclamation",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "services", // make sure this matches your Service collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "service"
                }
            },
            {
                $unwind: "$service"
            },
            {
                $project: {
                    serviceName: "$service.libelle",
                    count: 1
                }
            }
        ]);

        res.status(200).json({ monthlyStats: reclamations, serviceStats: services });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}