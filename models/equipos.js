
 const mongoose = require('mongoose')

 const Schema = mongoose.Schema

 const equiposSchema = new Schema({
    equi_id:{type:Number},
    equi_nombre:{type:String,Trim:true,unique:true,lowercase:true},
})

module.exports = mongoose.model('equipos',equiposSchema)
