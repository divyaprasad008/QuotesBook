import { Router } from "express";
import multer from "multer";

const router = Router()
import { getQuotes, getQuotesById } from "../controllers/quotes.controller.js";

router.route('/').get(getQuotes)
router.route('/:id').get(getQuotesById)

export default router

