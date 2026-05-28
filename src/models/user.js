const mongoose  = require("mongoose");
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
        trim: true
    },
    password:{
        type:String,
        required: true
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
        default: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqgMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUCAwYBB//EADgQAAICAQIDBQUHAgcBAAAAAAABAgMEBRESITEGMkFRkSJCYXGBExRSYrHR8cHhNENTgpKToST/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAFZqWr1YcnXBfaWrqt9lH5knUcn7piWXbbtL2V8fA42UnNucm3Jvd7+IEvM1LJy5e3Nxh+CD2RD2Q+YA8cU/BGEqtu4bD0Dbh6tmYb2ja5wXuT5/wBzqNM1OnUIPg9mxd6D6r90cbZH3hjX2Y10LqZNTi/UD6CDTiZEcnHruh0nHc3AAAAAAAAAAAAAAAAAUfaibVNNa96Tfp/JQwg7J8EerLrtQvax38JL9CpwpqGTW/Di2f1AlU6a22rZP4NMj5eJZj89t4eEi98EeSSlFxnzi+qA5s8JuXgTpblX7Ve/h4EL9fiB5Pusj7kyymz7D7RQbg11RES5AdV2Vtc8Gyt/5dnL5PmXZzvZHu5S+Mf6nRAAAAAAAAAAAAAAAAAU3aavixa7Pwy/X+ClwseV0+Je5JHS6uoyxeCUVKMpLcp9MjwSvj5S5ATlyWx6AANU8eqzvQizaANKqhVU4wWy8im1PHjW1bBbJvZ7F7Z3GVWqLemEfOaQFh2ShtjX2bd6xL0X9y+Kns/tCidUVsoy39f4LYAAAAAAAAAAAAAAAACHqkW8fde692V2PWoqT8W92XdkVOLi+jWxUquVPFCa6Pl8QPQAAAAGNnODIORBWV+14NSLAizrlZJwri3KT22QEzQ4tQtm1yckl9C1NWNUqaIVrwXP4m0AAAAAAAAAAAAAAAAARc6PsxkvAlGFkOOEovxAqwZTi4zafgzEAAAPG9k2btLjvOdn0I9u+yjFbt8tkWmLV9jTGHl1A3LoAAAAAAAAAAAAAAAAAAAAArNQkoZK+MTXy8D3VX/9EV5RIkZyj0fICUDR9u/JGu2ycovmtgN+FardQgl0W5do53S5cOdX8d0dEgAAAAAAAAAAAAAAAAABi5JLd8l5sDIwnZCEW5ySRTal2m0/D3jXYsi38NfRfN9Dk8rXsrMylbekoruwh7v7gdTkWO26c30fQ1lTi6spxSk1P67MmLPoa58S/wBoEo8fNM0ffsf8b/4swlqFS6KTAzhJ1zUovaUXujo8PMpy4N1WRk48pRXWLOD1DVOHfhfCvKL3bKzE1jMw8pZGNPgfRwa3Ul5MD6uDmtK7XYOWlDMf3a383cfyf7nRQsjZFSrkpRfRp7pgZg8TPQAAAAAAAAAAA5/tDnazg1uzEppdC62JOUo/NHF5ep5ub/isqyxeW+y9EfU2k001uczq3ZKnJlK3AlHHsfNwa9hv+gHDgt8nszquOuJ4/wBol41S4v8AwqrK51zcLIShJdYyWzQGJnG62PdskvqYADb95v8A9WXqYytsl3rJP6mAAGuUPI2GzHx7sm1VY9U7JvpGK3AiNPyJOHqGZgvfDybKvyxfL06HQY/Y7ULEnbZTUn4NttehPxuxGPGSllZVk/y1rhXrzAg6b2t1ay2NDxYZdj5JRjwyfpyO4olZOmEroKFjW8oqW6T8tzRp+m4en18GJjwrT6tc2/m+pLAAAAAAAAAAAAAABXato+JqlXDkV7TXdtjylH9/kWIA+e6h2V1DFlJ48Y5FXg4cpehS2020ycbqrK2vCUWj621ueOEZLaSUl5PmB8h4l5r1NlNVlzSprnNvwjFs+q/c8V9cen/rRsjXGC2hGMV5JbAcFpvZTPymnk7Y1X5u8/kjstN0vG0ylV41ezfem+cpPzbJqWx6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//Z"
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