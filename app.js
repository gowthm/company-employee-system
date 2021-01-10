const express = require('express')
const app = express();
const employee = require('./controller/employeeDetail');
const bodyParser=require('body-parser'); 
const port = 3030;
const company = require('./controller/companyDetail');
const mongoose = require('mongoose');
const connection = 'mongodb://localhost:27017/user_profiles';
app.use(bodyParser.urlencoded({extended: true}));  
app.use(bodyParser.json());
app.use('/employee', employee);
app.use('/company', company);
mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true}, function(error, client) {
    if (error) {
        console.log('Error', error);
    }
}
);
app.listen(port , console.log('server started from ' + port));