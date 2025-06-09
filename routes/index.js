import express from "express";
import * as authCtr from "../controllers/authenticationController.js";
import * as fileCtr from "../controllers/fileUploaderController.js";

//for uploading files
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/register", authCtr.getRegister);
router.post("/register", authCtr.postRegister);
router.get("/login", authCtr.getLogin);
router.post("/login", authCtr.postLogin);
router.get("/logout", authCtr.getLogout);
router.get("/", (req, res) => res.redirect("/login"));

router.get("/home", authCtr.isAuth, fileCtr.getHome);

router.post("/upload", authCtr.isAuth, upload.single('fileToUpload'),fileCtr.postUpload);
router.post("/delete/:fileID", authCtr.isAuth, fileCtr.postDelete);

router.post("/create-folder",authCtr.isAuth,fileCtr.postNewFolder);
router.post("/deleteFolder/:folderID",authCtr.isAuth,fileCtr.deleteFolder);

router.post("/move-file/:fileID",authCtr.isAuth,fileCtr.postMoveFolder);

router.get("/folder/:folderName",authCtr.isAuth,fileCtr.getFolder);
export default router;
