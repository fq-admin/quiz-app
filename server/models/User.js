import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String},
    username: {type: String, required: true,unique:true},
    email: {type: String, required: true,unique:true},
    password: {type: String, required: true},
    score: {type: Number, default: 0},
    image: {type: String}
});

const UserModel = mongoose.model("User", UserSchema);

export {UserModel as User};