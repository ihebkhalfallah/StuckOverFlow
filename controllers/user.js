import User from '../models/user.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

//sign in methode 
export function signIn(req, res) {
  const { email, password } = req.body;

  // Find the user by email in the database
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the user is verified
      if (!user.verified) {
        return res.status(401).json({ error: 'User not verified' });
      }

      // Compare the provided password with the hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        if (result) {
          // Passwords match, user is authenticated
          const token = jwt.sign({ userId: user._id }, 'yourSecretKey'); // Generate the token

          // Save the token in the user's document
          user.token = token;
          user.save();

          return res.status(200).json({ email: user.email, token: token });
        } else {
          // Passwords do not match, authentication failed
          return res.status(401).json({ error: 'Authentication failed' });
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}
// verify user by code methode
export async function verifyUser(req, res) {
  const { userId, verificationCode } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the verification code
    if (verificationCode != user.verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Update the user's verification status
    user.verified = true;
    //user.verificationCode = ""; // Clear the verification code
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}


// Generate a random 5-digit code methode
function generateVerificationCode() {
  return Math.floor(10000 + Math.random() * 90000);
}


// send email with verification code 
export function sendEmail(email, verificationCode) {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Set up your email service configuration
    // For example, using Gmail SMTP:
    service: 'Gmail',
    auth: {
      user: 'omartaamallah4@gmail.com',
      pass: 'xulr xaza rvyd heis'
    }
  });

  // Configure the email options
  const mailOptions = {
    from: 'omartaamallah4@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${verificationCode}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      // Handle the error here or send an error response
    } else {
      console.log("Email sent:", info.response);
      // Handle the success or send a success response
    }
  });
}
//send verification code 
export async function sendVerificationCode(req, res) {
  try {
    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Send verification code by email
    await sendEmail(req.body.email, verificationCode);

    // Return success response
    res.json({ success: true });
  } catch (error) {
    // Return error response
    res.status(500).json({ error: 'Failed to send verification code.' });
  }

}

// Sign Up 
export function createUser(req, res) {
  const userData = req.body;
  const password = userData.password;

  // Generate a salt to use for hashing
  bcrypt.genSalt(5, (err, salt) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    // Hash the password using the generated salt
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Replace the plain password with the hashed password
      userData.password = hash;

      // Create a new user with the encrypted password
      const user = new User(userData);

      // Generate a verification code
      const verificationCode = generateVerificationCode();

      // Set the verification code in the user object
      user.verificationCode = verificationCode;

      user.save()
        .then(newUser => {
          // Send verification code email
          sendEmail(user.email, verificationCode);

          // Send the response
          res.status(201).json(newUser);
        })
        .catch(err => {
          res.status(500).json({ error: err });
        });
    });
  });
}


// get all users
export function getUsers(req, res) {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
}

// Middleware for token authorization
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

  if (token == null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'yourSecretKey', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Token is valid, set the user on the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
}

// get user by id
export function getUserById(req, res) {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

// update user
export async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password is being updated
    if (updatedData.password) {
      const password = updatedData.password;

      // Generate a salt to use for hashing
      const salt = await bcrypt.genSalt(5);

      // Hash the password using the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);

      // Replace the plain password with the hashed password
      updatedData.password = hashedPassword;
    }

    // Update other user properties with the updated data
    user.name = updatedData.name || user.name;
    user.email = updatedData.email || user.email;
    user.password = updatedData.password || user.password;
    user.age = updatedData.age || user.age;
    user.address = updatedData.address || user.address;
    user.verified = updatedData.verified || user.verified;
    user.verificationCode = updatedData.verificationCode || user.verificationCode;
    user.role = updatedData.role || user.role;

    await user.save(); // Save the updated user

    res.json(user); // Return the updated user
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete user by id
export function deleteUser(req, res) {
  const userId = req.params.id;

  User.findByIdAndDelete(userId)
    .then((user) => {
      if (user) {
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
// get all users with admin role
export async function displayAdminUsers() {
  try {
    const adminUsers = await User.find({ role: 'admin' });
    console.log(adminUsers);
  } catch (error) {
    console.error(error);
  }
}

// get users with user role
export async function displayRegularUsers() {
  try {
    const regularUsers = await User.find({ role: 'user' });
    console.log(regularUsers);
  } catch (error) {
    console.error(error);
  }
}
