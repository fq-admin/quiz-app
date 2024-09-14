import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import multer from 'multer';
import path from 'path';
import fs from 'fs'

router.post('/signup', async (req, res) => {
    const { username, email, password,firstname,lastname } = req.body
    const mail=await User.findOne({email})
    if(mail){
        return res.json({message:"email"})
    }
    const name=await User.findOne({username})
    if(name){
        return res.json({message:"username"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        image:'',
    })

    await newUser.save()
    return res.json({status:true,message:"User created successfully"})
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({ message: "User does not exist" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.json({ message: "Invalid credentials" })
    }
    console.log(user)
    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '1h' })
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true})
    return res.json({ status: true, message: "User logged in successfully" })
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "User does not exist" })
        }
        const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '10m' })

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'aadityavir11@gmail.com',
              pass: 'xleu wopa qhti ngne'
            }
          });
          
          var mailOptions = {
            from: 'aadityavir11@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return res.json({status:false,message:"error sending email"})
            } else {
              return res.json({status:true,message:"email sent"})
            }
          });

    } catch (error) {
        console.log(error)
    }
})

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    try{
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY)
        const id=decoded.id
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({_id:id}, { password: hashedPassword })
        return res.json({status:true,message:"Password reset successfully"})
    }
    catch(error){
        return res.json({status:false,message:"Invalid or expired token"})
    }
})

const verifyUser = async (req, res, next) => {
    const token = req.cookies.token
    try {
        if (!token) {
            // console.log("no token")
            return res.json({status:false, message: "no token" })
        }
        const decoded = jwt.verify(token, process.env.KEY)
        next()
    } catch (error) {
        return res.json(error)
    }
}

router.get('/verify',verifyUser, (req, res) => {
    return res.json({status:true,message:"authorized"})
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({status:true,message:"logged out"})
})

router.get('/scores',async (req,res)=>{
    const users = await User.find({}, 'username score')
    return res.json(users)
})

router.post('/score', async (req, res) => {
    const token = req.cookies.token
    const { score } = req.body
    try{
        const decoded = jwt.verify(token, process.env.KEY)
        const id=decoded.id
        const user = await User.findById(id)
        if (!user) {
            return res.json({ status: false, message: "User not found" })
        }
        const newScore = user.score + score
        await User.findByIdAndUpdate(id, { score: newScore })
        return res.json({ status: true, message: "Score updated successfully" })
    }
    catch(error){
        return res.json({status:false,message:"Invalid or expired token"})
    }
})



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/Images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

const upload=multer({
    storage:storage
})

router.post('/upload',upload.single('file'), async (req, res) => {
    const token = req.cookies.token
    // const file = req.file
    try {
        const decoded = jwt.verify(token, process.env.KEY)
        const id = decoded.id
        const user =await User.findById(id)
        if (!user) {
            return res.json({ status: false, message: "User not found" })
        }
        const oldImage = user.image
        if(oldImage!=''){ 
            fs.unlinkSync('public/Images/'+oldImage);
        }
        await User.findByIdAndUpdate(id, { image: req.file.filename })
        return res.json({ status: true, message: "Image uploaded successfully" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, message: "Invalid or expired token" })
    }
})

router.get('/removeimage', async (req, res) => {
    const token = req.cookies.token
    try {
        const decoded = jwt.verify(token, process.env.KEY)
        const id = decoded.id
        const user = await User.findById(id)
        if (!user) {
            console.log("user not found")
            return res.json({ status: false, message: "User not found" })
        }
        const oldImage = user.image
        console.log(user.image)
        if(oldImage!=''){
            fs.unlinkSync('public/Images/'+oldImage);
        }
        await User.findByIdAndUpdate(id, { image: '' })
        return res.json({ status: true, message: "Image removed successfully" })
    } catch (error) {
        // console.log(error)
        return res.json({ status: false, message: "Invalid or expired token" })
    }
})


    
router.get('/profile', async (req, res) => {
    const token = req.cookies.token
    try {
        const decoded = jwt.verify(token, process.env.KEY)
        const id = decoded.id
        const user = await User.findById(id)
        if (!user) {
            return res.json({ status: false, message: "User not found" })
        }
        // console.log(user.image)
        return res.json({ status: true, score: user.score, username: user.username,firstname:user.firstname,lastname:user.lastname,email:user.email,image:user.image })
    } catch (error) {
        return res.json({ status: false, message: "Invalid or expired token" })
    }
})


router.post('/editprofile', async (req, res) => {
    const token = req.cookies.token
    const { username, email} = req.body
    try{
        const decoded = jwt.verify(token, process.env.KEY)
        const id=decoded.id
        const user=await User.findById(id)
        if(!user){
            return res.json({status:false,message:"User not found"})
        }
        if(user.email!=email){
            const mail=await User.findOne({email})
            if(mail){
                return res.json({message:"email"})
            }
        }
        if(user.username!=username){
            const name=await User.findOne({username})
            if(name){
                return res.json({message:"username"})
            }
        }
        await User.findByIdAndUpdate(id,req.body)
        return res.json({status:true,message:"Profile updated successfully"})
    }
    catch(error){
        return res.json({status:false,message:"invalid or expired token"})
    }
})

router.post('/changepass', async (req, res) => {
    const token = req.cookies.token
    const { oldpassword, newpassword } = req.body
    try{
        const decoded = jwt.verify(token, process.env.KEY)
        const id=decoded.id
        const user=await User.findById(id)
        if(!user){
            return res.json({status:false,message:"User not found"})
        }
        const isMatch = await bcrypt.compare(oldpassword, user.password)
        if (!isMatch) {
            return res.json({ message: "Invalid credentials" })
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        await User.findByIdAndUpdate(id, { password: hashedPassword })
        return res.json({status:true,message:"Password changed successfully"})
    }
    catch(error){
        return res.json({status:false,message:"invalid or expired token"})
    }
})



export { router as UserRouter}