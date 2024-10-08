class ErrorResponse extends Error{
    constructor(statusCode, message="Something Went Wrong", errors=[], stack=''){
        super(message)
        this.statusCode = statusCode;
        this.message = message
        this.errors = errors
        if(stack){
            this.stack = stack
         }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ErrorResponse}