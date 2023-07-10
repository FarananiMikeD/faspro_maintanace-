const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketPurchaseSchema = new Schema({
    //* This ID could be the ID of the peoples i'm buying the tickets for
    userId: {
        // type: Schema.Types.ObjectId,
        type: String,
        ref: "User",
        // required: true,
    },
    //* The buyer ID it's the ID of the personnel currently buying the tickets 
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    tickets: [
        {
            ticketPrice: {
                type: Schema.Types.ObjectId,
                ref: "TicketPrice",
                required: true,
            },
            photo: {
                type: String,
            },
            id_Document: {
                type: String,
            },
            paidAmount: {
                type: Number,
                required: true,
                min: 0,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const TicketPurchase = mongoose.model("TicketPurchase", ticketPurchaseSchema);

module.exports = TicketPurchase;
