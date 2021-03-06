"use strict";

/** Express app for education. */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const ExpressError = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const unitRoutes = require("./routes/unitRoutes");
const loginRoute = require("./routes/loginRoute");
const userRoutes = require("./routes/userRoutes");
const standardsRoutes = require("./routes/standardsRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

app.use(express.json());
app.use(cors());

//logging
app.use(morgan("dev"));

app.use("/login", loginRoute);

// all other routes require a token
app.use(authenticateJWT);

app.use("/units", unitRoutes);
app.use("/users", userRoutes);
app.use("/standards", standardsRoutes);
app.use("/questions", questionRoutes);

/** Handle 404 errors */
app.use(function (req, res, next) {
  return next(new ExpressError("Not Found", 404));
});

/** Generic error handler */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
