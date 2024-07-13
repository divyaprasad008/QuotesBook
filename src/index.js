// console.log(`===== src/index.js ======`)
import express from "express";
import env from "dotenv/config"
import userRouter from "./routes/user.routes.js"

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const port = env.PORT || 2000
app.listen(port,()=>{
    console.log(`Quotesbook started on port ${port}`)
})
// app.post('/profile',upload.none(), function (req, res, next) {
//     console.log(req.body)
//     res.json(req.body)
//   })
  
app.use('/api/v1/user',userRouter);