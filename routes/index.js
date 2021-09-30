import express from "express";
import {
  addRezervacija,
  getPanelById,
  getPanels,
} from "../controllers/adminController.js";
import {
  authUser,
  getUsers,
  login,
  pocetna,
  registerUser,
  logout,
  trazi,
  updateUserProfile,
  getUserProfile,
} from "../controllers/userController.js";
import { admin, checkUser, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/register").post(registerUser).get(protect, admin, getUsers);

router.route("/").get(checkUser, getPanels, pocetna); //pocetna stranica
//Logiranje korisnika
router.get("/login", login);
router.post("/login", authUser);
//Odjava korisnika
router.get("/logout", logout);

//Za pretrazivanje panela po gradovima
router.post("/trazi", trazi);

router.route("/panel/:id").get(getPanelById).post(checkUser, addRezervacija);

export default router;
