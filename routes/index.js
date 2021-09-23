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
router.route("/").get(checkUser, getPanels, pocetna);
router
  .route("/user_profile_edit/:id")
  .get(checkUser, getUserProfile)
  .put(checkUser, updateUserProfile);

router.post("/login", authUser);
router.get("/logout", logout);
router.get("/login", login);

router.post("/trazi", trazi);

router.route("/").get(getPanels); //radi
// .post(checkUser, addRezervacija);
//router.route("/panel/:id").get(getPanelById); //radi

router.route("/panel/:id").get(getPanelById).post(checkUser, addRezervacija);

export default router;
