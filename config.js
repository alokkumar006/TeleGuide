const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/TelecomData')   
.then(()=>{
    console.log("Database connection done");
}).catch(()=>{
    console.log("Something went wrong!");
})