import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { pool } from "../db/index.js";
import { getFormattedDate } from "../utils/MyDateTime.js";


const searchUser = asyncHandler(async function(req, res){
    try {
        let {keyword} = req.body;
        let result  =  await pool.query("SELECT id, firstname, lastname from users where firstname like $1 OR lastname like $1 OR username like $1",['%'+keyword+'%']);
        console.log(result.rows)
        let usersData = []
        let message = "No data found";
        if(result.rows.length>0){
            usersData = result.rows;
            message = "Success";
        }
        res.send(new ApiResponse(200, message, usersData))
    } catch (error) {
        res.status(500).send(new ErrorResponse(500,error?.message || "Internal Server Error",error.stack))
    }
})

const profile = asyncHandler(async function(req,res){
    try{

    }
    catch(error){
        res.status(500).send(new ErrorResponse(500,error?.message || "Internal Server Error",error.stack))
    }
})

const addFriend = asyncHandler(async function(req,res){
    try{
        let {friendId} = req.body;
        let friendExist = await  pool.query('SELECT * from users where id=$1',[friendId]);
        if(friendExist.rows.length==0){
            throw new ErrorResponse(404, "Friend not found");
        }
        let isExist = await pool.query('SELECT * from friends where "userId"=$1 and "friendId"=$2',[req.userId,friendId]);
        if(isExist.rows.length>0){
            res.send(new ApiResponse(200,"Friend Already added!"))
            return
        }
        let result = await pool.query('Insert into friends ("createdAt", "updatedAt", "userId", "friendId") values($1,$2,$3,$4) RETURNING id'
            ,[getFormattedDate(),getFormattedDate(),req.userId,friendId])
        if(!result.rows.length>0){
            throw new ErrorResponse(500,"Error adding friend");
        }
        else{
            res.send(new ApiResponse(200,"Friends Added successfully!"))
        }
    }
    catch(error){
        res.status(500).send(new ErrorResponse(500,error?.message || "Internal Server Error",error.stack))
    }
})

const friendRequestReceived = asyncHandler(async function(req,res){
    try{
        //display friends request
        let result = await pool.query('SELECT * FROM friends INNER JOIN Users ON friends.userId = Users.id WHERE friends.friendId = $1 AND friends.isAccepted = 0',[req.userId]);
        console.log(result);
        if(result.rows.length==0){
            res.send(new ApiResponse(200,"No Request Found",[]));
            return;
        }
        if(result.rows.length>0){
            for(let friend of result.rows){
                
            }
        }
    }
    catch(error){
        res.status(500).send(new ErrorResponse(500,error?.message || "Internal Server Error",error.stack))
    }
})

const userInbox = asyncHandler(async function(req,res){
    try{
        //display inbox with quotes suggested by friends
    }
    catch(error){
        res.status(500).send(new ErrorResponse(500,error?.message || "Internal Server Error",error.stack))
    }
})

const shareQuote = asyncHandler(async function(req,res){
    try{
        //req = note, quoteid, friendid
        //store in inbox
    }
    catch(error){
        res.status(500).send(new ErrorResponse(500,error?.message || "Internal Server Error",error.stack))
    }
})


export {searchUser, profile, addFriend, userInbox, shareQuote, friendRequestReceived};