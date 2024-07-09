import { Router } from "express";
import { signup } from "../controllers/user.controller.js";

const router = Router();

// router.get('/',getUsers);
// router.get('/:id',getUserById);
router.route('/signup').post(signup);
// router.post('/login',loginUser);


export default  router