const UserModel = require('../models/usemodels');
const {verifyToken, verifyTokenAuthorization,verifyTokenAdmin} = require('./verifyToken');
const router = require('express').Router();
const CryptoJS = require('crypto-js');


router.put('/:id', verifyTokenAuthorization, async(req,res)=>{
   if(req.body.password){
       req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECT_Key).toString()
   }
   try {
       const updateUser = await UserModel.findByIdAndUpdate(req.params.id, {
           $set: req.body
       }, {new:true})
    res.status(200).json(updateUser);
} catch (err) {
    res.status(500).json(err);
    
}
});

//Delete user 
router.delete('/:id', verifyTokenAdmin, async(req,res)=>{
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(401).json("User is delete")

    } catch (err) {
        res.status(500).json(err);
    }
})

//Get Admin
router.get('/find/:id', verifyTokenAdmin, async(req,res)=>{
    try {
       const user = await UserModel.findById(req.params.id).select('-password');
    //    const {password, ...others} = user._doc;
       res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json(err);
    }
})



//Get all users
router.get('/', verifyTokenAdmin, async(req,res)=>{
    const query = req.query.new;
    try {
       const user = query 
       ? await UserModel.find({isAdmin:false}).sort({_id:-1}).limit(3).select('-password')
       : await UserModel.find();
       res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json(err);
    }
});


//Get users Stats
router.get("/stats", verifyTokenAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
         try {
         const data = await UserModel.aggregate([
             { $match:{ createdAt: {$gte: lastYear} } },
                 { $project:{ month: 
                    {$month: "$createdAt"},
                     },

                 },
                 {
                 $group:{
                     _id: "$month",
                     total: {$sum:1},
                 },
                 },
         ])
         res.status(200).json(data)
        } 
     
     catch (err) {
        res.status(500).json("Somethin not good");
         
     }
})





module.exports = router