const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require('./login-index');
require('./config');
const product = require('./content'); // Import your model
require('./login-config');
const Logindata = require('./login-content');

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';


const PORT = process.env.PORT || 7000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Server home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve search page
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Serve network distribution page
app.get('/network-distribution', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visualization.html'));
});

// API endpoint to search for user by UserID
app.get('/api/search', async (req, res) => {
  try {
    const user = await product.findOne({ UserID: req.query.userid });
    console.log(user);
    if (user) {
      res.json(user);
    } else {
      // console.log(req.query.userid);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API endpoint to fetch network distribution data
app.get('/api/network-distribution', async (req, res) => {
  try {
    const networkDistribution = await product.aggregate([
      {
        $group: {
          _id: null,
          network_1G: { $sum: '$network_1G' },
          network_2G: { $sum: '$network_2G' },
          network_3G: { $sum: '$network_3G' },
          network_4G: { $sum: '$network_4G' },
          network_5G: { $sum: '$network_5G' }
        }
      }
    ]);

    res.json(networkDistribution[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
      const { name, password } = req.body;

      // Check if the user already exists
      const existingUser = await Logindata.findOne({ name });
      if (existingUser) {
          return res.status(400).send("User already exists! Try a different name.");
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the new user
      const newUser = new Logindata({ name, password: hashedPassword });
      await newUser.save();

      // Redirect to login page or send success message
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
      res.status(500).send("Error during signup: " + error.message);
  }
});


// Login route
app.post("/login", async (req, res) => {
  try {
      const { name, password } = req.body;

      // Find the user by name
      const user = await Logindata.findOne({ name });
      if (!user) {
          return res.status(400).send("User not found!");
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(400).send("Incorrect password!");
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

      // Set the token as a cookie (or store it in the client)
      res.cookie('token', token, { httpOnly: true });

      // Redirect to the home page after successful login
      res.redirect('/index.html');
  } catch (error) {
      res.status(500).send("Error during login: " + error.message);
  }
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
  } catch (ex) {
      res.status(400).send("Invalid token.");
  }
}

// Endpoint to get the logged-in user's information
app.get('/user', authenticateToken, (req, res) => {
  res.json({ username: req.user.name });
});

// Example of a protected route
app.get("/home", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
