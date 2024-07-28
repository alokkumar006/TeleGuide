const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
require('./config');
const product = require('./content'); // Import your model

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
    if (user) {
      res.json(user);
    } else {
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
          network_5G: { $sum: '$network_5G' },
          basic: { $sum: '$CUSTSEGMENT_Basic' },
          silver: { $sum: '$CUSTSEGMENT_Silver' },
          gold: { $sum: '$CUSTSEGMENT_Gold' },
          platinum: { $sum: '$CUSTSEGMENT_Platinum' },
          signature: { $sum: '$CUSTSEGMENT_Signature' }
        }
      }
    ]);

    res.json(networkDistribution[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
