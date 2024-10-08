const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require('./login-config');
const Logindata = require('./login-content');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

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

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
