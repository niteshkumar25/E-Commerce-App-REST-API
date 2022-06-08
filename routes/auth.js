const router = require('express').Router();
const UserModel = require('../models/usemodels');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


router.post('/register', async(req,res)=>{
    const {username,email,password} = req.body;
    if(username&&email&&password){
    const newUser = await new UserModel({
        username:username,
        email:email,
        password:CryptoJS.AES.encrypt(password, process.env.SECT_Key).toString(),
    });
    try {
        const saveduser = await newUser.save();
        res.status(201).json(saveduser)
        
    } catch (error) {
        res.status(500).json(error)
        
    }
}
else{
    res.status(500).json("All fileds are require")  
}



})

router.post('/login', async(req,res)=>{
    try{
    const user = await UserModel.findOne({username: req.body.username});
    if(!user)  {
        res.status(401).json("Wrong")
//     res.status(401).json("Wrong")
}
else{
const hashpassword = CryptoJS.AES.decrypt(user.password, process.env.SECT_Key);
const OriginalPassword = hashpassword.toString(CryptoJS.enc.Utf8);

if(OriginalPassword !== req.body.password){ 
    res.status(401).json({msg:"Invalid Details"})
}
 else{
     const accessToken = jwt.sign(
         {id:user._id,
          isAdmin:user.isAdmin   
        },
        process.env.JWT_SECRET_KEY ,
        {expiresIn:'3d'})

    const {password, ...others} = user._doc


res.status(200).json({...others, accessToken});
}
}
}catch(err){
    res.status(500).json(err)
}


}
)

module.exports = router;



// const user = await UserModel.findOne({username:req.body.username});
// if(user === null){
//      // !user && res.status(401).json("Wrong")
//     res.status(401).json("Wrong")
// }
// else{
// const hashpassword = cryptojs.AES.decrypt(user.password, process.env.SECT_Key);
// const password = hashpassword.toString(cryptojs.enc.Utf8);

// if(password !== req.body.password){
// res.status(401).json({msg:"Invalid Details"})
// }else{

// res.status(200).json(user);
// }