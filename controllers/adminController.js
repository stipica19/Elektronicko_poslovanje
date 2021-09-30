import asyncHandler from "express-async-handler";
import Lokacija from "../models/lokacijaModal.js";
import Panel from "../models/panelModal.js";
import Rezervacija from "../models/rezervacijaModal.js";
import gotovaRezervacija from "../models/gotoveRezervacije.js";
import multer from "multer";

//Dohvacanje jedne lokacije
const getLocation = asyncHandler(async (req, res) => {
  const lokacija = await Lokacija.findById(req.params.id);
  console.log(lokacija);
  if (lokacija) {
    res.json(lokacija);
  } else {
    res.status(404);
    throw new Error("Lokacija ne postoji");
  }
});

//Dohvacanje svih lokacija
const getLocations = asyncHandler(async (req, res) => {
  const locations = await Lokacija.find({});
  res.json(locations);
});

//Dodavanje lokacije
const addLocation = asyncHandler(async (req, res) => {
  const { grad, adresa } = req.body;

  const locationExists = await Lokacija.findOne({ adresa });

  if (locationExists) {
    res.status(400);
    throw new Error("Lokacija vec postoji");
  }

  const location = await Lokacija.create({
    grad,
    adresa,
  });
  if (location) {
    res.status(201).json({
      _id: location._id,
      grad: location.grad,
      adresa: location.adresa,
    });
  } else {
    res.status(400);
    throw new Error("Pogrešni podaci za lokaciju");
  }
});

//Update lokacije
const updateLocation = asyncHandler(async (req, res) => {
  const location = await Lokacija.findById(req.params.id);

  if (location) {
    location.grad = req.body.grad || location.grad;
    location.adresa = req.body.adresa || location.adresa;

    const updateLocation = await location.save();

    res.json({
      _id: updateLocation._id,
      grad: updateLocation.grad,
      adresa: updateLocation.adresa,
    });
  } else {
    res.status(404);
    throw new Error("Lokacija za update ne postoji!!");
  }
});

//Brisanje lokacije
const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Lokacija.findById(req.params.id);

  if (location) {
    await location.remove();
    res.json({ message: "Lokacija izbrisana" });
  } else {
    res.status(404);
    throw new Error("Lokacija za brisanje ne postoji!!");
  }
});

/*=================PANEL CONTROLLER========================*/

const getAddPanel = asyncHandler(async (req, res) => {
  const locations = await Lokacija.find({});
  res.render("addpanel.ejs", {
    locations,
  });
});

//Set Storage Engine
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// INIT Upload

var upload = multer({ storage: storage, limits: { fieldSize: 100000 } }).single(
  "images"
);

const addPanel = asyncHandler(async (req, res) => {
  const { dimenzija, id_lokacija, pocetna_cijena, brojMjesta, opis } = req.body;

  console.log(req.file);

  const panelExists = await Panel.findOne({ id_lokacija });

  if (panelExists) {
    res.status(400);
    throw new Error("Panel na toj lokacij vec postoji");
  }
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (req.file == undefined) {
        console.log("greska");
      } else {
        console.log(req.file);
        const panel = new Panel({
          dimenzija: req.body.dimenzija,
          images: req.file.filename,
          id_lokacija: req.body.id_lokacija,
          pocetna_cijena: req.body.pocetna_cijena,
          brojMjesta: req.body.brojMjesta,
          opis: req.body.opis,
        });
        panel
          .save()
          .then((res) => {
            console.log("Uspijesno smo spremili panel u bazu" + res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });
});

const getPanelById = asyncHandler(async (req, res) => {
  console.log("object");
  const panel = await Panel.findById(req.params.id);

  if (panel) {
    res.render("rezerviraj", {
      panel,
    });
  } else {
    res.status(404);
    throw new Error("Panel ne postoji");
  }
});

const getPanels = asyncHandler(async (req, res) => {
  const panel = await Panel.find({}).populate("id_lokacija").exec();

  if (panel) {
    res.render("indexx", {
      panel: panel,
    });
  } else {
    res.status(404);
    throw new Error("Greška kod dohvacanja svih panela");
  }
});

const getUpdatePanela = asyncHandler(async (req, res) => {
  const panel = await Panel.findById(req.params.id).populate("id_lokacija");
  const locations = await Lokacija.find({});
  res.render("editPanel.ejs", {
    panel,
    locations,
  });
});

const updatePanel = asyncHandler(async (req, res) => {
  console.log("update put panel");
  const panel = await Panel.findById(req.params.id);

  if (panel) {
    panel.dimenzija = req.body.dimenzija || panel.dimenzija;
    panel.id_lokacija = req.body.id_lokacija || panel.id_lokacija;
    panel.brojMjesta = req.body.brojMjesta || panel.brojMjesta;
    panel.opis = req.body.opis || panel.opis;
    panel.slika = req.body.slika || panel.slika;

    const updatePanel = await panel.save();

    res.redirect("/");
  } else {
    res.status(404);
    throw new Error("Panel za update ne postoji!!");
  }
});

const deletePanel = asyncHandler(async (req, res) => {
  const panel = await Panel.findById(req.params.id);

  const rezervacija = await Rezervacija.findOne({ panel: req.params.id });

  if (rezervacija) {
    throw new Error("Postoji rezervacija na tom panelu!!");
  } else {
    if (panel) {
      await panel.remove();
      res.redirect("/");
      //res.json({ message: "Panel uspjesno izbrisana" });
    } else {
      res.status(404);
      throw new Error("Panel za brisanje ne postoji!!");
    }
  }
});

const addRezervacija = asyncHandler(async (req, res) => {
  console.log("object");
  // const { user, panel, cijena, odDatuma, doDatuma } = req.body;
  const { ukupna_cijena, odDatuma, doDatuma } = req.body;

  console.log("ID PANELA ", req.params.id, "Cijena :", ukupna_cijena);
  const user = res.locals.user._id;
  console.log("Prijavljeni korisnik je : ", user);
  const panel = await Panel.findById(req.params.id);
  //console.log(pane);

  if (panel) {
    if (parseInt(panel.brojMjesta) === 0) {
      throw new Error("Broj mjesta za reklamu je popunjen");
    } else {
      //Stvara novu rezervaciju
      const rezervacija = await Rezervacija.create({
        user,
        panel,
        cijena: ukupna_cijena,
        odDatuma,
        doDatuma,
      });
      if (rezervacija) {
        panel.brojMjesta = parseInt(panel.brojMjesta) - 1;
        const panelMjesta = await panel.save();
        res.redirect("/");
      } else {
        res.status(400);
        throw new Error("Greška prilikom rezerviranja  panela");
      }
    }
  } else {
    res.status(404);
    throw new Error("Panel ne postoji");
  }
});

const vrijeme1 = asyncHandler(async (req, res) => {
  const rez = await Rezervacija.findById({
    _id: "613fafd5185c502194e2fb45",
  }).populate("panel");
  console.log("ID od rezerviranog panela : " + rez.panel._id);
  const panel = await Panel.findById(rez.panel._id);
  if (rez) {
    if (rez.doDatuma < new Date()) {
      console.log(rez.doDatuma);
      console.log("Trenutni datum : " + new Date().toISOString());
      console.log("Istekla rezervacija");
      //SLJEDI KOD ZA POVECANJE SLOBODNIH MJESTA

      panel.brojMjesta = parseInt(panel.brojMjesta) + 1;
      const panelMjesta = await panel.save();
    } else {
      console.log(rez.doDatuma);
      console.log("Trenutni datum : " + new Date().toISOString());
      console.log("Traje jos rezervacija");
    }
  }
});

const panelFunkcija = async (panelId) => {
  const panel = await Panel.findById(panelId);
  console.log("PANEL KOJI UPDATEAMO : ", panel);

  if (panel.brojMjesta < 5) {
    console.log("object");
    panel.brojMjesta = parseInt(panel.brojMjesta) + 1;

    const panelMjesta = panel.save();
  } else {
    console.log("VEC JE MAX BROJ SLOODNIH MJESTA");
  }
};

const vrijeme = async () => {
  const niz = [];
  const rez = await Rezervacija.find();

  console.log(rez);
  //console.log("ID od rezerviranog panela : " + rez[0].doDatuma);
  //const panel = await Panel.findById(rez[0].panel);
  rez.map((r) => {
    console.log("ID OD REZERVIRANOG PANELA : ", r.panel._id);
    if (r) {
      if (r.doDatuma < new Date()) {
        console.log(r.doDatuma);
        console.log("Trenutni datum : " + new Date().toISOString());
        console.log("Istekla rezervacija :  " + r._id);
        console.log("Rezervacijaaaa : " + r._id);
        //SLJEDI KOD ZA POVECANJE SLOBODNIH MJESTA
        const rez1 = Rezervacija.findById(r._id)
          .populate({
            path: "panel",
            populate: {
              path: "id_lokacija",
            },
          })
          .then((doc) => {
            console.log(doc._id);
            console.log(doc.panel.id_lokacija.grad);
            console.log(doc.panel.dimenzija);

            gotovaRezervacija
              .insertMany({
                user: doc.user,
                grad: doc.panel.id_lokacija.grad,
                dimenzija: doc.panel.dimenzija,
                opis: doc.panel.opis,
                cijena: doc.cijena,
                odDatuma: doc.odDatuma,
                doDatuma: doc.doDatuma,
              })
              .then((d) => {
                console.log("YESSSSSSSSSS");
              })
              .catch((error) => {
                console.log(error);
              });
          });
        Rezervacija.findByIdAndDelete(r._id, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Rezervacija uklonjena : ", docs);
          }
        });

        panelFunkcija(r.panel);
      } else {
        console.log(r.doDatuma);
        console.log("Rezervacija traje jos : " + r._id);
      }
    }
  });
};

function provjeraRezervacije() {
  console.log("ccc");
  vrijeme();
}

//setInterval(provjeraRezervacije, 5000);

export {
  getLocation,
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
  addPanel,
  getPanelById,
  getUpdatePanela,
  getPanels,
  updatePanel,
  deletePanel,
  addRezervacija,
  getAddPanel,
  panelFunkcija,
};
