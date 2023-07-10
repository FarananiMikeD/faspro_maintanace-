const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionDocumentSchema = new mongoose.Schema({
    object: {
        type: String,
        default: "documents",
    },
    name: {
        type: String,
        required: [true, "Document name is required"]
    },
    description: {
        type: String,
        required: [true, "Document description is required"]
    },
    document: {
        type: String,
        required: [true, "PDF or Word Document is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    session_Id: {
        type: Schema.Types.ObjectId,
        ref: "Sessions",
        required: [true, "Please provide the session ID"],
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const SessionDocument = mongoose.model("sessionDocument", sessionDocumentSchema);

module.exports = SessionDocument;