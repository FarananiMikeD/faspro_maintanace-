const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceProviderSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true    
  },
  contactPerson: {
    type: String,
    required: true    
  },
  contact: {
    phone: Number,
    email: String,
    required: true   
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
    country: String
  },

  bankDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bankDetails',
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ['user'], // WE MUST HAVE PROPERTY OWNER
    required: true
  },
  services: [String],
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  assignedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  feedback: {
    rating: Number,
    comment: String,
    images: [String]
  }
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider;

