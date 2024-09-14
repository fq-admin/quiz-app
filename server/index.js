import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { UserRouter } from './routes/user.js'


const app = express()
app.use(express.json())

app.use(express.static('public'))

app.use(cors(
    {
        origin: ["http://localhost:5173"],
        credentials: true
    }
))
app.use(cookieParser())
app.use('/auth', UserRouter)


mongoose.connect(process.env.URI).then(() => {
    console.log("Connected to database")
}
).catch((err) => {
    console.log(err)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})