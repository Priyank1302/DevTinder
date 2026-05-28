const mongoose = require("mongoose");

const connectDb = async () =>{
  await mongoose.connect("mongodb+srv://priyankmsd007_db_user:BxGMbkGmvt2zSYsG@namastenode.hk7zprv.mongodb.net/devTinder?appName=NamasteNode");

}

module.exports = connectDb



