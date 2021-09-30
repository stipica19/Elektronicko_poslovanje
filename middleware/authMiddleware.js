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
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);

        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const admin = (req, res, next) => {
  if (res.locals.user && res.locals.user.isAdmin) {
    next();
  } else {
    res.redirect("/");
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin, checkUser };
