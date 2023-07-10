const invoiceSettingModel = require('../models/invoiceSettingModel');
const factory = require('../controllers/handleFactory');

exports.createInvoiceSettings = factory.createOne(invoiceSettingModel);
exports.getInvoiceSettings = factory.getOne(invoiceSettingModel);
exports.updateInvoiceSettings = factory.updateOne(invoiceSettingModel);

