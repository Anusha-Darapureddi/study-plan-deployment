const mongoose=require("mongoose")
const noteSchema=new mongoose.Schema({
    subject:{type:String,required:true},
    date:{type:String,required:true},
    time:{type:String,required:true},
    email:{type:String,required:true},
   
},{timestamps:true})
module.exports=mongoose.model.Note||mongoose.model('Note',noteSchema)