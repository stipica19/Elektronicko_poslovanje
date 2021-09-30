import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

import User from "../models/userModal.js";
import Rezervacija from "../models/rezervacijaModal.js";
import Panel from "../models/panelModal.js";
import gotovaRezervacija from "../models/gotoveRezervacije.js";
import { panelFunkcija } from "./adminController.js";

const login = asyncHandler(async (req, res) => {
  res.render("login.ejs");
});

const pocetna = asyncHandler(async (req, res) => {
  res.render("indexx.ejs");
});

//LOGIN
const authUser = asyncHandler(async (req, res) => {
  console.log("LOGINNNNNNNNNNNNNNNNNNNn");
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    console.log(token);
    res.cookie("jwt", token, { expire: 360000 + Date.now() });

    res.redirect("/users/profile");
    console.log("USER USPJESNO LOGIRAN !!!");
  } else {
    res.status(401);
    throw new Error("Pogrešna lozinka ili email");
  }
});

const logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
};

const user = (req, res) => {
  res.render("user.ejs");
};

//Registiranje novog usera-a
const registerUser = asyncHandler(async (req, res) => {
  console.log("object");
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User vec postoji");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Pogrešni podaci za usera");
  }
});

//Dohvacanje profila od usera -radi
const getUserProfile = asyncHandler(async (req, res, next) => {
  console.log("aaaaaaaa", res.locals.user._id);
  const user = await User.findById(res.locals.user._id);

  if (user) {
    res.render("updateUserProfile.ejs", {
      user,
    });
    next();
  } else {
    res.status(404);
    throw new Error("User ne postoji!!");
  }
});

//Update user profil - radi
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log("updateUserProfile");
  const user = await User.findById(res.locals.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.redirect("/");
  } else {
    res.status(404);
    throw new Error("User ne postoji!!");
  }
});

//Lista svih user-a
const getUsers = asyncHandler(async (req, res) => {
  console.log("afssafsafsa");
  const users = await User.find({});
  res.json(users);
});

// Dohvacanje 1 usera
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Brisanje user-a
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User izbrisan" });
  } else {
    res.status(404);
    throw new Error("User ne postoji");
  }
});

//Update user-a
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserRezervation = asyncHandler(async (req, res, next) => {
  console.log("rezrrvacija", res.locals.user._id);
  const rezervacija = await Rezervacija.find({
    user: res.locals.user._id,
  })
    .populate({
      path: "panel",
      populate: {
        path: "id_lokacija",
      },
    })
    .exec();
  const old = await gotovaRezervacija
    .find({
      user: res.locals.user._id,
    })
    .populate({
      path: "panel",
      populate: {
        path: "id_lokacija",
      },
    })
    .exec();

  if (rezervacija) {
    res.render("user.ejs", {
      rezervacija: rezervacija,
      old: old,
    });
    next();
  } else {
    res.status(404);
    throw new Error("User ne postoji!!");
  }
});

const deleteUserRezervation = asyncHandler(async (req, res) => {
  console.log("deleteUserRezervation");
  const rezervacija = await Rezervacija.findById(req.params.id);

  if (rezervacija) {
    panelFunkcija(rezervacija.panel);
    await rezervacija.remove();

    res.redirect("/users/profile");
  } else {
    res.status(404);
    throw new Error("Rezervacija ne postoji");
  }
});

const trazi = asyncHandler(async (req, res) => {
  if (req.body.query == undefined) {
  } else {
    const regex = new RegExp(escapeRegex(req.body.query), "gi");
    console.log(regex);

    var query = Panel.find({})
      .populate({
        path: "id_lokacija",
        match: { grad: regex },
        select: "grad",
      })
      .exec(function (err, lokacija) {
        const result = lokacija.filter((word) => word.id_lokacija != null);
        console.log(result);
        if (err) {
          return res.send(err);
        }
        if (!lokacija) {
          return res.status(401).json();
        }

        res.status(200).json(result);
      });
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  login,
  logout,
  pocetna,
  getUserRezervation,
  deleteUserRezervation,
  user,
  trazi,
};
