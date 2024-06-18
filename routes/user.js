import express from 'express'; 

import {signIn,createUser,deleteUser,getUserById,getUsers,updateUser,displayAdminUsers,displayRegularUsers,verifyUser,sendVerificationCode,authenticateToken} from "../controllers/user.js"
const router = express.Router();

router.post('/', createUser);
router.get('/', authenticateToken,getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/displayAdminUsers',displayAdminUsers);
router.get('/displayRegularUsers',displayRegularUsers);
router.post('/signin', signIn);
router.get("/verify/:userId/:verificationCode", verifyUser);

// Route to send the verification code
router.post('/send-verification-code', sendVerificationCode);
// // verify user email verification
// router.get("/verify/:id/:token", controller.verifyEmail);

// Route to verify the code
//router.post('/verify-code', verifyCode);
export default router;