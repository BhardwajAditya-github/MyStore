import express from "express";
import { registerController, loginController, testController } from '../controllers/authController.js';
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";

// Router object

const router = express.Router();

// Routing
// RGISTER || METHOD POST
router.post('/register', registerController)

// LOGIN || POST

router.post('/login', loginController)

// TEST ROUTE

router.get("/test", requiredSignIn, isAdmin, testController)

router.get('/user-auth', requiredSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

export default router