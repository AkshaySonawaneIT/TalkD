const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://akshaysonawane1958:Akshay123@cluster0.ppwugco.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI,{useNewUrlParser: true, 
        useUnifiedTopology: true, 
        }, () => {
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo