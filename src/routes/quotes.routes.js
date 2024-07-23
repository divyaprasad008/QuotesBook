import { Router } from "express";
import multer from "multer";

const router = Router()
import { getQuotes, getQuotesById } from "../controllers/quotes.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.route('/').get(verifyJwt,getQuotes)
router.route('/:id').get(getQuotesById)

export default router

