module.exports = app => {
  const codingChallenge = require("../controllers/codingChallenge.controller.js");

  var router = require("express").Router();

  // uploads csv data
  router.post("/", codingChallenge.upload);

  app.use("/api/coding-challenge", router);
};
