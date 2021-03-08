const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

dotenv.config();

//IMPORT ROUTES

const authRoutes = require('./routes/authRoutes');


// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTE MIDDLEWARES
app.use('/auth', authRoutes);

app.get('/',(req,res)=>{
    res.send('hello world');
});

// CONNECTION TO DATABASE

const connection_url = process.env.DB_KEY;
  // or connection_url = "mongodb://localhost:27017/JWTapiDB";

mongoose.connect(connection_url, {
   
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,

}).then(()=>{
    console.log('connection successfuly..')
}).catch((err)=>{
    console.log(err)
})


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})







