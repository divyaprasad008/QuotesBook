import { Router } from "express";
import { signup, login } from "../controllers/user.controller.js";
import { searchUser, profile, addFriend, userInbox, shareQuote, friendRequestReceived } from "../controllers/userUtility.controller.js";
import multer from "multer";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const upload = multer();

const router = Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user in quotesbook
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - firstname
 *               - lastname
 *               - username
 *               - email
 *               - password   

 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   description: A success message indicating user creation
 *                 data:
 *                   type: object
 *                   description: User details
 *                   properties:
 *                      firstname:
 *                          type: string
 *                          description: Firstname of user
 *                      lastname:
 *                          type: string
 *                          description: Lastname of user
 *                      email:
 *                          type: string
 *                          description: Email of user
 *                      username:
 *                          type: string
 *                          description: Username of user
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Bad request
 *       404:
 *         description: Required field missing
 *       409:
 *         description: Record already exist
 *       500:
 *         description: Internal server error or Database error
 */
router.route('/signup').post(upload.none(),signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with already registered user
 *     description: This api logins a user, processes the data, authenticates a user and returns token along with user data
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string   
 *                 userData:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route('/login').post(login);

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Search for users
 *     description: Searches for users based on their first name, last name, or username.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: The search keyword to be used for filtering users.
 *     responses:
 *       200:
 *         description: Users found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating success or failure.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user's unique identifier.
 *                       firstname:
 *                         type: string
 *                         description: The user's first name.
 *                       lastname:
 *                         type: string
 *                         description: The user's last name.
 *       500:
 *         description: Internal server error
 */
router.route('/search').post(verifyJwt,searchUser);

/**
 * @swagger
 * /addFriend:
 *   post:
 *     summary: Add a friend
 *     description: Adds a friend to the user's friend list.
 *     tags:
 *       - Friends
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendId:
 *                 type: integer
 *                 description: The ID of the friend to add.
 *     responses:
 *       200:
 *         description: Friend added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Friend not found
 *       500:
 *         description: Internal server error
 */
router.route('/addFriend').post(verifyJwt,addFriend);

/**
 * @swagger
 * /getFriendRequests:
 *   get:  # Assuming this endpoint uses GET method
 *     summary: Get friend requests
 *     description: Retrieves a list of pending friend requests for the authenticated user.
 *     tags:
 *       - Friends
 *     responses:
 *       200:
 *         description: Friend requests found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   # Include properties retrieved from the database for friend information
 *                   # (e.g., friendId, username, firstName, lastName)
 *                   friendId:  # Replace with actual property names if different
 *                     type: integer
 *                     description: The ID of the friend who sent the request.
 *                   username:  # Replace with actual property names if different
 *                     type: string
 *                     description: The username of the friend who sent the request.
 *                   firstName:  # Replace with actual property names if different
 *                     type: string
 *                     description: The first name of the friend who sent the request.
 *                   lastName:  # Replace with actual property names if different
 *                     type: string
 *                     description: The last name of the friend who sent the request.
 *       404:
 *         description: No friend requests found
 *       500:
 *         description: Internal server error
 */
router.route('/getFriendRequests').post(verifyJwt,friendRequestReceived);




router.route('/profile').post(verifyJwt,profile);


router.route('/inbox').post(verifyJwt,userInbox);


export default  router