const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

require('./config'); // Database connection
const TelecomData = require('./content'); // Import your model

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

app.get("/", (req, res) => {
    res.sendFile('index.html')});

// Endpoint to search for UserID
app.get('/search', async (req, res) => {
  const { userid } = req.query; // Get the userid from query parameters
  try {
    const data = await TelecomData.findOne({ UserID: userid }); // Find the user by UserID
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


//visualise data
app.get('/network-distribution', async (req, res) => {
  try {
    const networkDistribution = await TelecomData.aggregate([
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

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
