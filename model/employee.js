const mongoose = require('mongoose');
const Schema = require('mongoose');
const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    employeeId: String,
    phoneNo: Number,
    role: String,
    companyCode: String,
    isReportManager: Boolean,
    toReportManager: [{ type: Schema.Types.ObjectId, ref: 'employee' }],
})
module.exports = employeeSchema;
module.exports = mongoose.model(
    'employee', employeeSchema, 'employee'); 
