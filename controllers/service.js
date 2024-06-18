
import Reclamation from '../models/reclamation.js';
import Service from '../models/service.js';

export function getServices(req, res) {
    Service.find({})
    .then(services => {
        res.status(200).json(services);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

export function addService(req, res) {
    const service = new Service(req.body);
    service.save()
    .then(newservice => {
        res.status(201).json(newservice);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

export function getService(req, res) {
    Service.findById(req.params.id)
    .then(service => {
        res.status(200).json(service);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}
export function DeleteService(req, res) {
    Service.findByIdAndDelete(req.params.id)
    .then(service => {
        Reclamation.deleteMany({typeReclamation:service._id})
        .then(recs => {
            res.status(200).json(service);
        }).catch(err => {
            res.status(500).json(err);
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
}


export function updateService(req, res) {
    Service.findByIdAndUpdate(req.params.id,req.body)
    .then(service => {
        res.status(200).json(service);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}



// Search Services by key
export const searchServices = async (req, res) => {
    const { key } = req.params;
    try {
        const services = await Service.find({ libelle: new RegExp(key, 'i') }); // 'i' flag for case-insensitive search
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};