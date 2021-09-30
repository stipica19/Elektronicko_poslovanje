import express from "express";
const router = express.Router();

import {
  getLocation,
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
  addPanel,
  getUpdatePanela,
  getPanels,
  updatePanel,
  deletePanel,
  addRezervacija,
  getAddPanel,
} from "../controllers/adminController.js";

import { protect, admin, checkUser } from "../middleware/authMiddleware.js";

router
  .route("/lokacije")
  .post(protect, admin, addLocation) //radi
  .get(protect, admin, getLocations); //radi

//Rute za jednu lokaciju
router
  .route("/lokacije/:id")
  .delete(protect, admin, deleteLocation) //radi
  .get(protect, admin, getLocation) //radi
  .put(protect, admin, updateLocation);

/*==========RUTE ZA PANEL ============ */
router
  .route("/addpanel")
  .get(checkUser, admin, getAddPanel)
  .post(checkUser, admin, addPanel); //dodat adminu ovlast

router
  .route("/panel_edit/:id")
  .get(getUpdatePanela)
  .delete(checkUser, admin, deletePanel)
  .put(checkUser, admin, updatePanel); //radi--admin

export default router;
