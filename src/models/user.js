const mongoose  = require("mongoose");
const validator  =require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value)
        {
          if(!validator.isEmail(value))
          {
              throw new Error("Invalid email address: " + value)
          }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Weak password, please enter a strong password")
            }
        }
    },
    age:{
        type:Number,
        min: 18
    },
    gender:{
        type:String,
        validate(value)//this only runs when u create a new object/user, dies not run on patch
        {
            if(!["male","female","others"].includes(value))
            {
                throw new Error("Gender data is not valid!")

            }
        }
    },
    photoUrl:{
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(value)
        {
            if(!validator.isURL(value))
            {
                throw new Error("Inavlid URL!")
            }
        }
    },
    about:{
        type: String,
        default: "This is the default description of the User."
    },
    skills:{
       type: [String] ,
       validator(value)
       {
           if(value>5)
           {
            throw new Error("Skills cannot be more than 5!")
           }
       }
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema);

module.exports = User;