/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DefaultService');
const group_documentsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.group_documentsGET);
};

const group_documentsGroupDocIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.group_documentsGroupDocIdDELETE);
};

const group_documentsGroupDocIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.group_documentsGroupDocIdGET);
};

const group_documentsGroupDocIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.group_documentsGroupDocIdPUT);
};

const group_documentsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.group_documentsPOST);
};


module.exports = {
  group_documentsGET,
  group_documentsGroupDocIdDELETE,
  group_documentsGroupDocIdGET,
  group_documentsGroupDocIdPUT,
  group_documentsPOST,
};
