const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('Jsonwebtoken');
const User = require('../models/authModel');

router.get('/',(req,res)=>{
   res.send('hello from auth routes');
});


// VERIFY-JWT

const verifyJWT = (req,res,next)=>{
      const token = req.headers["x-access-token"]

      if(!token){
            res.send("Hey, we need a token, plz provide us next time")
      }else{
            jwt.verify(token,process.env.TOKEN_SECRET,(err,decoded)=>{

            if(err){
               res.json({ auth: false, message: 'you failed to authenticate'});
            }else{
               req.userId = decoded.id;   
               next();
            }

            });
      }
};



router.get('/allUser', verifyJWT, (req,res)=>{
   User.find().then((allUser)=>{
         res.json({ allUser});
   }).catch((err)=>{
         res.json(err);
   })
});

router.get('/isUserAuth',(req,res)=>{
      res.send('yes user is authenticated')
})
// REGISTER ROUTE

router.post('/register', async(req, res) => {

      // CHECKING USER IS ALREADY IN THE DATABASE
       const emailExist = await User.findOne({email: req.body.email});
       if (emailExist) return res.status(400).send('Email already exists');         
 
      // HASH PASSWORD
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
      const user = new User({
             username: req.body.username,
             email: req.body.email,
             password: hashedPassword
       });
       try{
            const savedUser = await user.save();
            res.send(savedUser); 
       }catch(err){
             res.status(400).send(err);
       }
 });


// LOGIN ROUTES

router.post('/login', async (req,res) => {
     
      // CHECKING USER IS ALREADY IN THE DATABASE
       const user = await User.findOne({username: req.body.username});
       if (!user) return res.status(400).send('Email or password is wrong');         
      // PASSWORD IS CORRECT    
       const pass = await bcrypt.compare(req.body.password, user.password);
       if(!pass) return res.status(400).send('Email or password is wrong ..');
        
    
       //CREATE AND ASSIGN A TOKEN
       const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET ,{
             expiresIn: 300,
       });
      //  res.header('auth-token', token).send(token); 
       res.json({auth: true, token: token, result: user})
    
});      


module.exports = router;