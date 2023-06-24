const express =require('express')
const mongoose=require('mongoose')
const Razorpay=require('razorpay')
const app= express()
const cors = require('cors');
const Product=require('./models/Signin')
const Bill=require('./models/payment')
const port=8000

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:'false'}))

app.get('/',(req,res) => {
    res.send("Hello NODE dreama API")
})

//login
app.post('/signin/:username',async(req,res)=>{
    try {
        const {username}=req.params
        const signin=await Product.find({username});
        if(!signin){
            return res.status(404).json({message:'Cannot Find account with username ${username}'})
            }
        res.status(200).json(signin)
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
})
//Signin
app.post('/signin',async(req,res)=>{
    try {
        const signin=await Product.create(req.body)
        res.status(200).json(signin);
        
    } catch (error) {
       console.log(error.message);
       res.status(500).json({message: error.message}) 
    }
})

//bill
app.post('/bill',async(req,res)=>{
    try {
        const bill=await Bill.create(req.body)
        res.status(200).json(bill);
        
    } catch (error) {
       console.log(error.message);
       res.status(500).json({message: error.message}) 
    }
})

//past passes
app.post('/bill/:name',async(req,res)=>{
    try {
        const {name}=req.params
        const getbill=await Bill.find({name});
        if(!getbill){
            return res.status(404).json({message:'Cannot Find account with name ${name}'})
            }
        res.status(200).json(getbill)
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
})


mongoose.connect('mongodb+srv://GetPass:getpass@getpass.wlzryhy.mongodb.net/')
.then(() =>{
    app.listen(port,()=>{
        console.log('Connected to MongoDB')
        console.log('Node API is running.')
    }) 
})
.catch(()=>{
    console.error('Didnt connect to Mongo DB')
})

const razorpay = new Razorpay({
    key_id: 'rzp_test_dsqpBlsd93gkpG',
    key_secret: 'TELsj1NBPn6xmgqtFqyM9tAn',
  });

  app.post('/create-order', async (req, res) => {
    try {
      const options = {
        amount: 5000, 
        currency: 'INR',
        
      };
  
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create payment order' });
    }
  });


  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
