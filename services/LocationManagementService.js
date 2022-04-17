/* eslint-disable no-unused-vars */

const logger = require("../logger");

// [TODO] Stored to database
var location = {};

const uploadLocation = async (req, res) => {
  logger.info(`[SEAL][LM-S] ${req.method} ${req.originalUrl}`);
  try {
    if (req.params.user_id === undefined) throw {};
    location[req.params.user_id] = {
      lng: req.body.lng,
      lat: req.body.lat,
    };
    //logger.info(`lng: ${req.body.lng}, lat: ${req.body.lat}`);
    res.sendStatus(200);
  } catch (e) {
    res.send(e.message || "Invalid input", e.status || 405);
  }
};

const getLocation = async (req, res) => {
  logger.info(`[SEAL][LM-S] ${req.method} ${req.originalUrl}`);
  try {
    if (req.params.user_id === undefined) throw {};
    if (req.params.user_id in location) {
      res.send(location[req.params.user_id]);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.send(e.message || "Invalid input", e.status || 405);
  }
};

module.exports = { uploadLocation, getLocation };
