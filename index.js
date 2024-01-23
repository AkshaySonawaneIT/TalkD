const connectToMongo  = require('./db');
const express = require('express')
var cors = require('cors');

connectToMongo();

const app = express()
const port = 5000

app.use(cors());
app.use(express.json()); // act as middleware to use request body if not used req.body will be undefined

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));

app.listen(port, () => {
  console.log(`Ecomm Product app listening on port ${port}`)
})