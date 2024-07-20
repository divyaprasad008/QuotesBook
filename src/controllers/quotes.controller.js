import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ErrorResponse } from "../utils/errorResponse.js"

const getQuotes = asyncHandler(await function(req, res){
    fetch("https://type.fit/api/quotes")
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        res.send(new ApiResponse(200,"Quotes fetched successfully",data));
    });
    
})

const getQuotesById = asyncHandler(await function(id){
    console.log(id)
})

export {getQuotes, getQuotesById}