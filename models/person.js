const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name:{
    type:String,
    minLength:3,
    required:true,
  },
  number:{
    type:String,
    minLength:8,
    validate:{
      validator:function(v){
        return /^\d{2,3}-\d+$/.test(v)
      },
      message:props => `${ props.value } is not valid phone number`
    },
    required:true,
  }
})

personSchema.set('toJSON',{
  transform:(document,returnedObj) => {
    returnedObj.id = String(returnedObj._id)
    delete returnedObj.__v
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person',personSchema)