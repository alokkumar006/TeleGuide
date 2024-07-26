const mongoose = require('mongoose');

// Define the schema
const telecomSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ARPUD1_30: Number,
  SUMVCEREVCD1_30: Number,
  SUMDATAREVCD1_30: Number,
  SUMDATAUSGCD1_30: Number,
  SUMVOICEUSGCD1_30: Number,
  LASTREVGENEVTDATE_days: Number,
  LASTRECHRGDATE_days: Number,
  SUMDATAUSG4G: Number,
  UserID: Number,
  ISDEVICE3GENABLED_enco: Number,
  VASSUBSCRIBERFLAG_enco: Number,
  ISDEVICEDATAENABLED_enco: Number,
  SMARTPHONEFLAG_enco: Number,
  network_1G: Number,
  network_2G: Number,
  network_3G: Number,
  network_4G: Number,
  network_5G: Number,
  DEVICETYPE_Feature: Number,
  DEVICETYPE_Smartphone: Number,
  DEVICETYPE_VoiceCentric: Number,
  CUSTSEGMENT_Basic: Number,
  CUSTSEGMENT_Gold: Number,
  CUSTSEGMENT_No_ne: Number,
  CUSTSEGMENT_Platinum: Number,
  CUSTSEGMENT_Signature: Number,
  CUSTSEGMENT_Silver: Number
}, { collection: 'Consumerdata' }); // Use the correct collection name

// Create the model
const TelecomData = mongoose.model('TelecomData', telecomSchema);

module.exports = TelecomData;
