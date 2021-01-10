const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    companyName: String,
    address: String,
    companyCode: String,
    phoneNo: Number,
})
module.exports = companySchema;
module.exports = mongoose.model(
    'company', companySchema, 'company'); 
