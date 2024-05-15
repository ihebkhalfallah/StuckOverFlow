import express from 'express';
import {check} from 'express-validator'
import {createUser} from '../controllers/user.js';

const router = express.Router();

router.post('/register',
[   
check('firstName', 'First name is required').not().isEmpty(),
check('lastName', 'Last name is required').not().isEmpty(),
check('nickName', 'Nickname is required').not().isEmpty(),
check('birthDate', 'Birthdate is required').isDate(),
check('role', 'Role is invalid').isIn(['ADMIN', 'COACH', 'NUTRITIONNISTE', 'USER']),
check('email', 'Please include a valid email').isEmail(),
check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
],
createUser);





export default router;
