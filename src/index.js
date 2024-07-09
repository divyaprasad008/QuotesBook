// console.log(`===== src/index.js ======`)
import express from "express";
import env from "dotenv/config"
import userRouter from "./routes/user.routes.js"
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express()
const port = env.PORT || 2000

import {pool} from "./db/index.js";
// console.log(pool)

// app.use(bodyParser.json()); // Enable JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // for URL-encoded data
app.use(morgan('dev'))

app.use('/api/v1/user',userRouter);



app.listen(port,()=>{
    console.log(`Quotesbook started on port ${port}`)
})