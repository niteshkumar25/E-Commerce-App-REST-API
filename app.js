const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config();
const router = require('./routes/user');
const auth = require('./routes/auth');
const product = require('./routes/product');
const cart = require('./routes/cart');
const order = require('./routes/order');

const PORT = process.env.PORT;

app.use(express.json())
app.use('/api/auth', auth)
app.use('/api/user', router);
app.use('/api/product', product);
app.use('/api/cart', cart);
app.use('/api/order', order) 


app.listen(PORT, ()=>{
    console.log("Sever is Running on ", PORT);
})




//MongoDb connect

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(()=>{
    console.log("Connection SucessFull");
}).catch((e)=>{
    console.log("Not Connect");
});
