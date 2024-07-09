import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorResponse } from "../utils/errorResponse.js";




const signup = asyncHandler(async(req,res)=>{
    try {
        const {firstname} = req.body;
        console.log("here");
        console.log(req.body);
        // pool.query('INSERT INTO users (firstname, lastname,email, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *'
        //     , [firstname, lastname, email, username, password]
        //     , (error, results) => {
        //         if (error) {
        //             throw error
        //         }
        //         res.status(201).send(`User added with ID: ${results.rows[0].id}`)
        //     }
        // )
    } catch (error) {
        console.error(error);
        res.status(500).send(new ErrorResponse("Internal server error"));
    }


})


export {signup}