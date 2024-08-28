// console.log(`===== src/index.js ======`)
import express from "express";
import env from "dotenv/config"
import userRouter from "./routes/user.routes.js"
import quotesRouter from "./routes/quotes.routes.js"

import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js'; // Import the generated specs


const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const port = env.PORT || 2000
  
// Integrate Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1/user',userRouter);
app.use('/api/v1/quotes',quotesRouter);

app.listen(port,()=>{
    console.log(`Quotesbook started on port ${port}`)
})