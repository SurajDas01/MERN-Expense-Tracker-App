const mongoose = require('mongoose');
require('dotenv').config(); // make sure .env variables are loaded

const mongo_url = process.env.MONGO_URI; // use the correct variable name

mongoose.connect(mongo_url)
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });
