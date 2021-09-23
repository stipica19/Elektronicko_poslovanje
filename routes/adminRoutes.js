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
  paypal,
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

router.get("/pay", paypal);

/*==========RUTE ZA PANEL ============ */
router.route("/addpanel").get(getAddPanel).post(checkUser, admin, addPanel); //dodat adminu ovlast
/*
router
  .route("/paneli")
  .get(getPanels) //radi
  .post(protect, addRezervacija);*/

//router.route("/paneli/:id/dodavanjeRezervacije").post(protect, addRezervacija);

router
  .route("/panel_edit/:id")
  .get(getUpdatePanela)
  .delete(checkUser, admin, deletePanel)
  .put(checkUser, admin, updatePanel); //radi--admin
//.get(getPanelById) //radi
//admin

export default router;
