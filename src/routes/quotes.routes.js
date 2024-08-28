import { Router } from "express";
import multer from "multer";

const router = Router()
import { getDummyQuotes,getQuotes, getQuotesById, pinQuotesToProfile, searchQuote } from "../controllers/quotes.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

/**
 * @swagger
 * /quotes:
 *   get:
 *     summary: Get a list of quotes
 *     description: Retrieves a list of quotes
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'   

 */
router.route('/').get(verifyJwt,getQuotes)

/**
 * @swagger
 * /quotes/getDummyQuotes:
 *   get:
 *     summary: Get quotes from dummy
 *     description: Retrieves all quotes from dummy
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'   

 */
router.route('/getDummyQuotes').get(verifyJwt,getDummyQuotes)


/**
 * @swagger
 * /quotes/pinQuotesToProfile:
 *   post:
 *     summary: Pin a quote to user's profile
 *     description: Pins a quote to the user's profile
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quoteId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quote pinned successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route('/pinQuotesToProfile').post(verifyJwt,pinQuotesToProfile)

/**
 * @swagger
 * /searchQuote:
 *   post:
 *     summary: Search for quotes
 *     description: Searches for quotes based on keywords in the quote, author, or category.
 *     tags:
 *       - Quotes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: The search keyword to be used for filtering quotes.
 *     responses:
 *       200:
 *         description: Quotes found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     # Replace with actual properties of your quote object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The quote's ID.
 *                       quote:
 *                         type: string
 *                         description: The quote text.
 *                       author:
 *                         type: string
 *                         description: The quote's author.
 *                       category:
 *                         type: string
 *                         description: The quote's category.
 *                       # ... other properties as needed
 *       404:
 *         description: No quotes found
 *       500:
 *         description: Internal server error
 */
router.route('/search').get(verifyJwt,searchQuote)


/**
 * @swagger
 * /quotes/{id}:
 *   get:
 *     summary: Get a specific quote
 *     description: Retrieves a quote by ID
 *     tags:
 *       - Quotes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Quote ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       404:
 *         description: Quote not found
 */
router.route('/:id').get(verifyJwt,getQuotesById)
export default router

