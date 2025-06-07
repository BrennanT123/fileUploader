import express from 'express';
import * as authCtr from "../controllers/authenticationController.js";


const router = express.Router();

router.get("/register", authCtr.getRegister);
router.post("/register", authCtr.postRegister);
router.get("/login",authCtr.getLogin);
router.post("/login", authCtr.postLogin);
router.get("/logout", authCtr.getLogout);



export default router;
