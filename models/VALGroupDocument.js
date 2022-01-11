const mongoose = require("mongoose");

const VALGroupDocumentSchema = new mongoose.Schema({
  valGroupId: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
      valUserId: {
        type: String,
        required: true,
      },
      valUeId: String,
    },
  ],
});

const VALGroupDocument = mongoose.model("val_groups", VALGroupDocumentSchema);

module.exports = VALGroupDocument;
