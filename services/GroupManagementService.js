/* eslint-disable no-unused-vars */
const Service = require("./Service");
const VALGroupDocument = require("../models/VALGroupDocument");
const logger = require("../logger");

/**
 * Retrieves VAL group documents satisfying filter criteria
 *
 * valGroupId String String identifying the VAL group. (optional)
 * valServiceId String String identifying the Val service. (optional)
 * returns List
 * */
const group_documentsGET = ({ valGroupId, valServiceId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await VALGroupDocument.find({ valGroupId });
      resolve(
        Service.successResponse(
          result.map((d) => ({
            valGroupId: d.valGroupId,
            members: d.members,
          }))
        )
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 405)
      );
    }
  });
/**
 * Deletes a VAL Group.
 *
 * groupDocId String String identifying an individual VAL group document resource.
 * no response value expected for this operation
 * */
const group_documentsGroupDocIdDELETE = ({ groupDocId }) =>
  new Promise(async (resolve, reject) => {
    try {
      await VALGroupDocument.deleteOne({ valGroupId: groupDocId });
      resolve(
        Service.successResponse({
          valGroupId: groupDocId,
        })
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 405)
      );
    }
  });
/**
 * Retrieves VAL group information satisfying filter criteria.
 *
 * groupDocId String String identifying an individual VAL group document resource.
 * groupMembers Boolean When set to true indicates the group management server to send the members list information of the VAL group. (optional)
 * groupConfiguration Boolean When set to true indicates the group management server to send the group configuration information of the VAL group. (optional)
 * returns VALGroupDocument
 * */
const group_documentsGroupDocIdGET = ({
  groupDocId,
  groupMembers,
  groupConfiguration,
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await VALGroupDocument.find({ valGroupId: groupDocId });
      resolve(
        Service.successResponse(
          result.map((d) => ({
            valGroupId: d.valGroupId,
            members: d.members,
          }))
        )
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 405)
      );
    }
  });
/**
 * Updates an individual VAL group document.
 *
 * groupDocId String String identifying an individual VAL group document resource
 * vALGroupDocument VALGroupDocument VAL group document to be updated in Group management server.
 * returns VALGroupDocument
 * */
const group_documentsGroupDocIdPUT = ({ groupDocId, valGroupDocument }) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await VALGroupDocument.updateOne(
        { valGroupId: groupDocId },
        { members: valGroupDocument["members"] }
      );
      resolve(Service.successResponse({ modified: result.modifiedCount }));
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 405)
      );
    }
  });
/**
 * Creates a new VAL group document.
 *
 * vALGroupDocument VALGroupDocument
 * returns VALGroupDocument
 * */
const group_documentsPOST = ({ valGroupDocument }) =>
  new Promise(async (resolve, reject) => {
    try {
      const new_group = new VALGroupDocument(valGroupDocument);
      await new_group.save();
      resolve(
        Service.successResponse({
          valGroupDocument,
        })
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 405)
      );
    }
  });

module.exports = {
  group_documentsGET,
  group_documentsGroupDocIdDELETE,
  group_documentsGroupDocIdGET,
  group_documentsGroupDocIdPUT,
  group_documentsPOST,
};
