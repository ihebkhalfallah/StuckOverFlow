import Commentaire from "../models/commentaire.js";


// Create a new Comment
export const addComment = async (req, res) => {
    try {
        const comment = new Commentaire(req.body);
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get  Comments
export async function getComments(req, res){
    try {
        const comments = await Commentaire.find({
            // usercomment:req.params.idUser,
            // reclamationComment:req.params.idrec,
        });
        console.log(comments);
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export function getallComments(req, res) {
    Commentaire.find()
    .then(c => {
        res.status(200).json(c);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

export function deleteComment(req, res) {
    Commentaire.findByIdAndDelete(req.params.id)
    .then(com => {
        res.status(200).json(com);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}


export function satisfaitComment(req, res) {
    Commentaire.findByIdAndUpdate(req.params.id,{selection:true},{new:true})
    .then(comm => {
        res.status(200).json(comm);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}
export function nonSatisfaitComment(req, res) {
    Commentaire.findByIdAndUpdate(req.params.id,{selection:false},{new:true})
    .then(comm => {
        res.status(200).json(comm);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}