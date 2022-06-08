const order = require('../models/order');
const {verifyToken, verifyTokenAuthorization,verifyTokenAdmin} = require('./verifyToken');
const router = require('express').Router();



//Create
router.post('/',verifyTokenAuthorization,async(req,res)=>{
    const newOrder = await new order(req.body);
     try {
         const SavedOrder = await newOrder.save();
         res.status(200).json(SavedOrder);
     } catch (err) {
         res.status(500).json(err)
         
     }
    
})
// //Update Product
router.put('/:id', verifyTokenAdmin, async(req,res)=>{
    try {
        const updateOrder = await order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
     res.status(200).json(updateOrder);
 } catch (err) {
     res.status(500).json(err);
     
 }
 });
 
//  //Delete Product
 router.delete('/:id', verifyTokenAdmin, async(req,res)=>{
     try {
         await order.findByIdAndDelete(req.params.id);
         res.status(401).json("Order has been Delete......")
 
     } catch (err) {
         res.status(500).json(err);
     }
 })
 

///Get User Orders
 router.get('/find/:userId', verifyTokenAuthorization,async(req,res)=>{
     try {
        const Order = await order.find({userID: req.params.userID});
     //    const {password, ...others} = user._doc;
        res.status(200).json(Order);
         
     } catch (err) {
         res.status(500).json(err);
     }
 })
 
 
 
///Get all Orders
router.get('/', verifyTokenAdmin, async(req,res)=>{
    try {
        const Orders = await order.find();
        res.status(200).json(Orders)
    } catch (err) {
        res.status(500).json(err)
        
    }

})


//Get Monthly Income
router.get('/income', verifyTokenAdmin, async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:
                {
                    month: {$month: "$createdAt"},
                    sales: "$amount" },
               
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}
                },
            },
        ])
        res.status(200).json(income)
        
    } catch (err) {
        res.status(500).json(err);
        
    }

})
 
 
module.exports = router;