const Product = require('../models/products');
const {verifyToken, verifyTokenAuthorization,verifyTokenAdmin} = require('./verifyToken');
const router = require('express').Router();



//Create

router.post('/', verifyTokenAdmin,async(req,res)=>{
    const newProduct = await new Product(req.body);
     try {
         const SavedProduct = await newProduct.save();
         res.status(200).json(SavedProduct);
     } catch (err) {
         res.status(500).json(err)
         
     }
    
})
//Update Product
router.put('/:id', verifyTokenAdmin, async(req,res)=>{
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
       
     res.status(200).json(updateProduct);
 } catch (err) {
     res.status(500).json(err);
     
 }
 });
 
 //Delete Product
 router.delete('/:id', verifyTokenAdmin, async(req,res)=>{
     try {
         await Product.findByIdAndDelete(req.params.id);
         res.status(401).json("Product has been Delete......")
 
     } catch (err) {
         res.status(500).json(err);
     }
 })
 
//  //Get Product
 router.get('/find/:id', async(req,res)=>{
     try {
        const Product1 = await Product.findById(req.params.id);
        console.log(Product1);
     //    const {password, ...others} = user._doc;
        res.status(200).json(Product1);
         
     } catch (err) {
         res.status(500).json(err);
     }
 })
 
 
 
//  //Get all Products
 router.get('/', async(req,res)=>{
     const qNew = req.query.new;
     const qCategory= req.query.categories;
     try {
         let Products;
         if(qNew){
             Products = await Product.find().sort({createdAt:-1}).limit(3) 
         } else if(qCategory){
            Products = await Product.find({categories:{
                $in:[qCategory],
            }, 
        
            }
        
        )
         }else{
            Products = await Product.find();
    
         }
        
         res.status(200).json(Products);
         
     } catch (err) {
         res.status(500).json(err);
     }
 });
 
 
 
module.exports = router;