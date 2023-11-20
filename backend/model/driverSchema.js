const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    job:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: true,
    },
    cpassword:{
        type: String,
        required: true,
    },
    latitude : {
        type : Number,
        required : true,
    },
    longitude: {
        type: Number,
        required: true,
      },
    tokens:[
        {
           token:{
                type:String,
                required:true
           }  
        }
    ]
});


//hashing the password

driverSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

// generating token

driverSchema.methods.generateAuthToken = async function(){
     try{
            let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
            this.tokens = this.tokens.concat({token:token});
            await this.save();
            return token;
     }catch(err){
         console.log(err);
     }
};

const Driver = mongoose.model('DRIVER', driverSchema);

module.exports = Driver;
