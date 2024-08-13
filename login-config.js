const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://TeleGuide:TeleGuide%40123@cluster0.hlh9dih.mongodb.net/TelecomData?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connection to TelecomData login done");
}).catch((error) => {
    console.error("Database connection error:", error);
});
