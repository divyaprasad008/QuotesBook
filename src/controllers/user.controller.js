import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { pool } from "../db/index.js";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;
console.log(saltRounds);
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'Test';
// import { MyDateTime } from "../utils/MyDateTime.js";

const myDate = function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = String(today.getMonth() + 1); // Add 1 for zero-based indexing
    let day = String(today.getDate());
  
    // Add leading zeros for single-digit month and day
    month = month.length === 1 ? `0${month}` : month;
    day = day.length === 1 ? `0${day}` : day;
  
    return `${year}-${month}-${day}`;
}

const signup = asyncHandler(async(req,res)=>{
    try{ 
        const {firstname, lastname, email, username, password } = req.body;
        // const reqData = {firstname:'password', lastname:"lastname", email:"email", username:"username", password:"password"};
        const emptyData = [];
        if(firstname==undefined || firstname?.trim()===""){
            emptyData.push("firstname");
        }
        if(lastname==undefined || lastname?.trim()===""){
            emptyData.push("lastname");
        }
        if(email==undefined || email?.trim()===""){
            emptyData.push("email");
        }
        if(username==undefined || lastname?.trim()===""){
            emptyData.push("username");
        }
        if(password==undefined || password?.trim()===""){
            emptyData.push("password");
        }
        
        // reqData.keys().map((field=>{
        //     if(field===undefined || field?.trim()===""){
        //         emptyData.push(reqData.field)
        //     }
        // }))
        
        if(emptyData.length>0){
            console.log(emptyData)
            throw new ErrorResponse(404,"All fields are required",emptyData)
        }

        const result = await pool.query({
            rowMode: 'array',
            text: 'SELECT id from users where email = $1;',
            values: [email]
        })

        if(result.rows.length>0){
            throw new ErrorResponse(500, "Record already exist")
        }

        const hash_password = await bcrypt.hash(password, 10);
        // console.log(password, saltRounds, hash_password);return;
            
        await pool.query('INSERT INTO users ("updatedAt", firstname, lastname,email, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
            , [myDate(),firstname, lastname, email, username, hash_password]
            , (error, results) => {
                if (error) {
                    throw new ErrorResponse(404,"Database Error",error.stack)
                }
                console.log(results)
                res.status(201).json(new ApiResponse(201,`User added with ID: ${results.rows[0].id}`,req.body))
                
            }
        )

    
    } catch (error) {
        res.status(500).send(error);
    }


})

const login = asyncHandler(async(req,res)=>{
    try {
        const {email, password} = req.body
        const result = await pool.query({
            // rowMode:"array",
            text:"SELECT id, firstname, lastname, password, username from users where email = $1",
            values:[email]
        })
        if(result.rows.length==0){
            throw new ErrorResponse(404,"User not found")
        }
        
        const hash_password = result.rows[0].password
        // const fields = result.fields.map(field => field.name)
        const isValid = await bcrypt.compare(password,hash_password)
        if(isValid){
            let userData = {
                'firstname':result.rows[0].firstname,
                'lastname':result.rows[0].lastname,
                'email':email,
                'username':result.rows[0].username,
            }
            var token = await jwt.sign(userData, 'secret');

            // await pool.query({
            // update refresh token
            // })
            // console.log(token);
            res.send({"token":token,"data":userData})
        }

        
    } catch (error) {
        res.status(500).send(error)
    }
    
})


export {signup, login}