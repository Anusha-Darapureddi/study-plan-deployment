const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const bcrypting=require("bcrypt")
const User=require('./models/signupdb.js')
const Note=require('./models/notesdb.js')

const app=express()
app.use(express.urlencoded({extended:true}))
dotenv.config()
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("mongodb connected succesfully")
})
const port = process.env.PORT || 8000
app.use(express.json())
app.get('/',(req,res)=>{
    res.sendFile("pages/home.html",{root:__dirname})
})
app.get('/signup',(req,res)=>{
    res.sendFile("pages/signup.html",{root:__dirname})

})
app.post('/signup',async(req,res)=>{
   try{
    const {name,email,password,phone}=req.body
   
    const hash=await bcrypting.hash(password,11)
    const newUser=await User.create({
        name,
        email,
        password:hash,
        phone
    })
  
    res.status(200).json({
        success:true,
        message:"signup succesfully",
        user:newUser
    })
   }
   catch(err){
    res.status(400).json({
        success:false,
        message:err.message
    })
   }
//     console.log(req.body)
//     res.json({success:"true"})
})
app.get('/login',(req,res)=>{
    res.sendFile("pages/login.html",{root:__dirname})
})
app.post('/login',async(req,res)=>{
    
    try{
        const {email,password}=req.body
        const loginuser=await User.findOne({email})
        if(!loginuser){
           return res.status(404).json({success:false,message:"not matched"})

        }
        const passwordCorrect=await bcrypting.compare(password,loginuser.password);
        if(!passwordCorrect){
            return res.status(401).json({success:false,message:"incorrect password"})
        }
      
            return res.status(200).json({
                success:true,loginuser:loginuser.email,message:"matched"
            })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            msg:err.msg
        })
    }
    // console.log(req.body)
    // res.json({success:"true"})
})

app.post('/addanote', async (req, res) => {
  console.log(req.body)   

  const { subject, date, time, email } = req.body

  if (!subject || !date || !time || !email) {
    return res.status(400).json({
      success: false,
      message: "Missing fields"
    })
  }

  await Note.create({
    subject,
    date,
    time,
    email
  })

  res.json({ success: true })
})

    // console.log(req.body)
    // res.json({success:"true"})

app.post("/getnotes",async(req,res)=>{
    const {email}=req.body
    let notes=await Note.find({email})//find relative note based on email
    res.status(200).json({
        success:true,
        notes
    })
})

app.delete("/deletenotes/:id",async(req,res)=>{
     try{
        await Note.findByIdAndDelete(req.params.id)
        res.json({success:true})
     }
     catch(err){
        res.status(404).json({success:false})
     }
})


app.listen(port,()=>{
    console.log("server started and running successfully")
})