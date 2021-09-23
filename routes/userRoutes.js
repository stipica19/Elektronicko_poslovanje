import express from "express";
import { addRezervacija, getPanels } from "../controllers/adminController.js";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  deleteUser,
  updateUser,
  updateUserProfile,
  getUserById,
  getUserRezervation,
  deleteUserRezervation,
  getUsers,
  login,
  pocetna,
  user,
} from "../controllers/userController.js";
import { protect, admin, checkUser } from "../middleware/authMiddleware.js";
/*
router.route("/register").post(registerUser).get(protect, admin, getUsers);
router.route("/").get(checkUser, getPanels, pocetna);

router.post("/login", authUser);*/
router.route("/profile").get(checkUser, getUserRezervation);

router.route("/:id").delete(checkUser, deleteUserRezervation);

//Rute za admina
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
