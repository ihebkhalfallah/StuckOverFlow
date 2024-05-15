import User from '../modules/user.js'
import {ExpressValidator} from 'express-validator';
import bcrypt from 'bcrypt'

const createUser= async(req,res)=>{

    const {
        firstName,lastName,nickName,birthDate,role,email,password,adresse,phoneNumber
    } = req.body;

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = new User({
            firstName,
            lastName,
            nickName,
            birthDate,
            role,
            email,
            password: hashedPassword,
            adresse,
            phoneNumber,
        
        });
        await user.save();

        res.status(201).json(user);
        
    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Server error' ,error:err.message});
    }
}


export {createUser};