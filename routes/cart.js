const cart = require('../models/cart');
const {verifyToken, verifyTokenAuthorization,verifyTokenAdmin} = require('./verifyToken');
const router = require('express').Router();



//Create
router.post('/',verifyToken,async(req,res)=>{
    const newCart = await new cart(req.body);
     try {
         const SavedCart = await newCart.save();
         res.status(200).json(SavedCart);
     } catch (err) {
         res.status(500).json(err)
         
     }
    
})
// //Update Product
router.put('/:id', verifyTokenAuthorization, async(req,res)=>{
    try {
        const updateCart = await cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
     res.status(200).json(updateCart);
 } catch (err) {
     res.status(500).json(err);
     
 }
 });
 
 //Delete Product
 router.delete('/:id', verifyTokenAuthorization, async(req,res)=>{
     try {
         await cart.findByIdAndDelete(req.params.id);
         res.status(401).json("Cart has been Delete......")
 
     } catch (err) {
         res.status(500).json(err);
     }
 })
 
//  //Get Product
 router.get('/find/:userId', verifyTokenAuthorization,async(req,res)=>{
     try {
        const carts = await cart.findOne({userID: req.params.userID});
     //    const {password, ...others} = user._doc;
        res.status(200).json(carts);
         
     } catch (err) {
         res.status(500).json(err);
     }
 })
 
 
 
// //  //Get all
router.get('/', verifyTokenAdmin, async(req,res)=>{
    try {
        const carts = await cart.find();
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
        
    }

})
 
 
module.exports = router;