const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    imgfile: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    profession: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

//hashing password
userSchema.pre("save",async function(next){
    // console.log(this);
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10); // salt=10
    }
    next();
})


const TunerUser = new mongoose.model("TunerUser", userSchema);
module.exports = TunerUser;