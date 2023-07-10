const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  ownerAttachment: {
    type: String   // Property owner attach image of property needed to be services
    
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ['user'], // WE MUST HAVE CLIENT THAT WE ARE SERVICING FOR
    required: true
  },

  description: String,
  status: {
    type: String,
    enum: ['Unassigned', 'Assigned', 'Work in Progress', 'Closed'],
    default: 'In Progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
