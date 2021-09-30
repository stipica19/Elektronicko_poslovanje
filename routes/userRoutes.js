import express from "express";
const router = express.Router();
import {
  getUserProfile,
  updateUserProfile,
  getUserRezervation,
  deleteUserRezervation,
} from "../controllers/userController.js";
import { protect, admin, checkUser } from "../middleware/authMiddleware.js";

//Dohvacanje podataka user-a
router.route("/profile").get(checkUser, getUserRezervation);

//Brisanje rezervacije tj. otkazivanje
router.route("/:id").delete(checkUser, deleteUserRezervation);

//editovanje user-ovog profila
router
  .route("/user_profile_edit/:id")
  .get(checkUser, getUserProfile)
  .put(checkUser, updateUserProfile);

export default router;
