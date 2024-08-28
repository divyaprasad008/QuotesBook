import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { pool } from "../db/index.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async(req, res, next)=>{
    try {
        // get token and remove Bearer
        const token = req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ErrorResponse(404,"Unauthorize request")
        }
        let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let decodedUserId = decodedToken?.id;
        let decodedUserEmail = decodedToken?.email;
        // console.log(decodedToken);
        // let decodedUserId = 14;
        if(!decodedUserId){
            throw new ErrorResponse(401,"Unauthorize Request")
        }
        let result = await pool.query({
            text:"SELECT email from users where id = $1",
            values:[decodedUserId]
        })
        if(result.rows.length==0){
            throw new ErrorResponse(404,"User not found")
        }
        if(!result){
            throw new ErrorResponse(401,"Invalid access token")
        }
        if(result.rows[0].email!=decodedUserEmail){
            throw new ErrorResponse(401,"Unauthorize Request")
        }
        req.userId = decodedUserId;
        req.email = decodedUserEmail;
        req.firstname = decodedToken?.firstname;
        req.lastname = decodedToken?.lastname;
        req.username = decodedToken?.username;

        next();
        // res.send(new ApiResponse(200,"Success",result));

    } catch (error) {
        // console.log("Error:",error.message)
        res.status(500).send(new ErrorResponse(401, error.message || "Invalid Token", error.stack))
    }

})