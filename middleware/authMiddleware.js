import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModal.js";

const protect = asyncHandler(async (req, res, next) => {
  console.log("proctect");
  let token = req.cookies.jwt;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Nema autorizacije, token pogrešan");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Nema autorizacije, token pogrešan");
  }
});

const checkUser = (req, res, next) => {
  // console.log("CHECK_USER");
  const token = req.cookies.jwt;
  if (token) {
    // console.log("CHECK_USER_token");
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        //   console.log("ERRRR_1");
        res.locals.user = null;
        next();
      } else {
        // console.log("ceck_userrrrr_find");
        let user = await User.findById(decodedToken.id);
        //console.log("====", user);
        res.locals.user = user;
        next();
      }
    });
  } else {
    // console.log("NULLLLLLLLLLLLLLLLLL");
    res.locals.user = null;
    next();
  }
};

const admin = (req, res, next) => {
  if (res.locals.user && res.locals.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin, checkUser };
