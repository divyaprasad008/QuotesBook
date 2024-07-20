import { Router } from "express";
import { signup, login } from "../controllers/user.controller.js";
import multer from "multer";
const upload = multer();


const router = Router();
router.post("/try", signup)

// router.get('/',getUsers);
// router.get('/:id',getUserById);
router.route('/signup').post(upload.none(),signup);
router.route('/login').post(login);



export default  router