const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repairSchema = new Schema({
  bikeName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Bitte geben Sie eine gültige E-Mail-Adresse ein'] 
  },
  status: {
    type: String,
    enum: ['Fertig', 'in Bearbeitung'], 
    default: 'in Bearbeitung'
  }
}, { timestamps: true });

const Repair = mongoose.model('RepairRequest', repairSchema);

module.exports = Repair;
