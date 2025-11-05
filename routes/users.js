const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

// 1- ROUTE "/register" - POST - REGISTRAR USUARIO
router
  .route("/register")
  .post(catchAsync(users.register));

// 2 - ROUTE "/login - POST  + PASSPORT" - AUTENTICAR USUARIO
router
  .route("/login")
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/api/login", // O React vai lidar com o redirecionamento, mas o Passport precisa de um fallback
    }),
    users.login
  );

// 3 - ROUTE "/logout" - GET - SAIR
router.get("/logout", users.logout);

// 4 - ROUTE "/current-user" - GET - Retorna o usuário logado (para o React)
router.get("/current-user", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

module.exports = router;
