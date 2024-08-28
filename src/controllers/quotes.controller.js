import { pool } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ErrorResponse } from "../utils/errorResponse.js"
import { getFormattedDate } from "../utils/MyDateTime.js";

async function fetchDummyQuotes(start=0){
    let fetchURL = process.env.QUOTES_URL+"?limit="+process.env.QUOTES_LIMIT+"&skip="+start;
    let response = await fetch(fetchURL);
    let data = response.json()
    return data;
    // let fetchURL = process.env.QUOTES_URL+"?limit="+process.env.QUOTES_LIMIT+"&skip="+start;
    // fetch(fetchURL)
    // .then(function(response) {
    //     return response.json();
    // }).then(function(data) {
    //     return data
    // });
}
const getDummyQuotes = asyncHandler(async function(req, res){
    // fetch quotes from site and store in db
    console.log("start:"+getFormattedDate());
    let alldata = [];
    let data = await fetchDummyQuotes()
    alldata.push(data);
    while(data.total>data.skip+data.limit){
        let data2 = await fetchDummyQuotes(data.skip+data.limit)
        // console.log(data2);
        data = data2
        alldata.push(data);
    
    }
    for (const myresp of alldata) {
        for(const quote of myresp.quotes){
            let category = quote?.category || '';

            let is_exist = await pool.query({rowMode:'array',text:'SELECT * from quotes where quote = $1',values:[quote.quote]})
            if(is_exist.rows.length>0){
                //update
                let updCount = await updateQuotes([getFormattedDate(),quote.quote,quote.author,category]);
                // console.log(updCount, quote.quote)
            }
            else{
                let lastId = await insertQuotes([getFormattedDate(),getFormattedDate(),quote.quote,quote.author,category]);
                // console.log(lastId);
            }
        }
    }
    res.send(new ApiResponse(200,"Quotes fetched successfully",["end:"+getFormattedDate()])); 
})

const getQuotes = asyncHandler(async function(req, res){
    // fetch quotes from database
    try {
        let start = req.body.start || 0;
        let limit = req.body.limit || 10;
        let result = await pool.query("SELECT * from quotes order by id asc limit $1 offset $2", [limit,start])
        if(result.rows.length==0){
            res.send(new ApiResponse(200,"No Data Found!"));
        }
        else{
            let countResult = await pool.query("SELECT count(*) as total from quotes")
            let data={
                total:countResult.rows[0].total,
                batchTotal:limit,
                quotes:result.rows
            }
            res.send(new ApiResponse(200,"Quotes fetched successfully",data));
        }
    } catch (error) {
        res.send(new ErrorResponse(500,"Error occured while fetching quotes",error.stack));
    }
})

async function insertQuotes(insvalues){
    const result = await pool.query('Insert into quotes("createdAt","updatedAt",quote,author,category) values ($1,$2, $3, $4, $5)  RETURNING id',insvalues)
    if (result.rows.length > 0) {
        return result.rows[0].id;
    }
    else{
        return 0;
    }
}

async function updateQuotes(updvalues){
    
    const result = await pool.query('Update quotes set "updatedAt" = $1, quote = $2, author=$3, category=$4 where quote=$2',updvalues)
    // console.log(result);
    if (result.rowCount > 0) {
        return result.rowCount;
    }
    else{
        return 0;
    }
}
const pinQuotesToProfile  = asyncHandler(async function(req,res){
    try {
        // get quote data
        // get userid
        // store quote data in quotes table
        // get quote id and store quote id in userQuotes table
        for(let eachQuote of req.body.quotes){
            let quoteId = eachQuote?.id || 0;
            let quoteOrder = eachQuote?.order || 0;
            const user_quotes_result = await pool.query('Insert into user_quotes ("createdAt","updatedAt","userId","quoteId","quoteOrder") values($1,$2, $3, $4, $5) RETURNING id',[getFormattedDate(),getFormattedDate(),req.userId,quoteId,quoteOrder])
            if(!user_quotes_result.rows.length>0){
                throw new ErrorResponse(500,"Quotes pinned failed")
            }
        }
    
        res.send(new ApiResponse(200,"Quotes pinned successfully to your profile"));
    
    } catch (error) {
        res.status(500).send(new ErrorResponse(401, error.message || "Invalid Token", error.stack))
    }
})

const getQuotesById = asyncHandler(async function(req,res){
    try {
        let id = (req.params.id);
        let result = await pool.query('SELECT * from quotes where id = $1',[id])
        if(result.rows.length>0){
            res.status(200).send(new ApiResponse(200,"successful",result.rows))
        }
        else{
            res.status(404).send(new ApiResponse(404,"Data Not Found"))
        }
    } catch (error) {
        res.status(500).send(new ErrorResponse(401, error.message || "Invalid Token", error.stack))
    }
})

const searchQuote = asyncHandler(async function(req,res){
    try {
        const searchword = req.body?.search?.trim(); // Extract and trim search term

        let result = await pool.query('SELECT * from quotes where quote like $1 OR author like $1 OR category like $1',['%'+searchword+'%'])
        // let result = await pool.query('SELECT * from quotes where "createdAt" like $1 OR "updatedAt" like $1 OR quote like $1 OR author like $1 OR caregory like $1',['%'+searchword+'%'])
        if(result.rows.length>0){
            res.status(200).send(new ApiResponse(200, "success",result))
        }
        else{
            res.status(404).send(new ApiResponse(404,"Data not Found",result))
        }
    } catch (error) {
        res.status(500).send(new ErrorResponse(401, error.message || "Invalid Token", error.stack))
    }
})

export {getDummyQuotes, getQuotes, getQuotesById, pinQuotesToProfile, searchQuote}