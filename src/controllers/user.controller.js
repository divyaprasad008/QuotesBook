import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { pool } from "../db/index.js";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";


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
            res.send(new ErrorResponse(404,"All fields are required",emptyData))
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
            text:"SELECT id, password from users where email = $1",
            values:[email]
        })
        if(result.rows.length==0){
            throw new ErrorResponse(404,"User not found")
        }
        
        const hash_password = result.rows[0].password
        // const fields = result.fields.map(field => field.name)
        const isValid = await bcrypt.compare(password,hash_password)
        const userId = result.rows[0].id;
        if(isValid){
            let {userData, accessToken, refreshToken} = await generateAccessAndRefreshToken(userId)
            
            await pool.query(
                'UPDATE users SET "refreshToken" = $1 WHERE id = $2',
                [refreshToken,  userId],
                (error, results) => {
                    if (error) {
                        throw error
                    }
                    console.log(`User modified with ID: ${userId}`)
                }
            )

            let sendData = {
                'userData': userData,
                'accessToken':accessToken,
                'refreshToken':refreshToken
            }
            res.status(200).json(new ApiResponse(200,`Login Successfully`,sendData))
        }

        
    } catch (error) {
        console.log(`Error:${error}`)
        res.status(500).send(new ErrorResponse(500,"Some Error",error.stack))
    }
    
})

async function generateAccessAndRefreshToken(userId){
    
    let result = await pool.query({
        text:'SELECT id, firstname, lastname, email, username, "refreshToken" from users where id = $1',
        values:[userId]
    })

    let userData = {
        'id':result.rows[0].id,
        'firstname':result.rows[0].firstname,
        'lastname':result.rows[0].lastname,
        'email':result.rows[0].email,
        'username':result.rows[0].username,
    }
    
    let accessToken = await generateAccessToken(userData)
    let refreshToken = await generateRefreshToken(userData)

    return {userData,accessToken, refreshToken};


}
 
async function generateAccessToken(userData){
    let token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
    // console.log("Access token",userData,process.env.ACCESS_TOKEN_SECRET,process.env.ACCESS_TOKEN_EXPIRY, token)
    return token;
    
}

async function generateRefreshToken(userData){
    let token = await jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
    // console.log("Refresh token",userData,process.env.REFRESH_TOKEN_SECRET,process.env.REFRESH_TOKEN_EXPIRY, token)
    return token;
    
}



export {signup, login}