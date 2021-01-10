const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminValidation = require('../auth/validation');
const employeeSchema = require('../model/employee');
const randomstring = require('randomstring');
const companySchema = require('../model/company');

// admin login by get token

router.post('/login', async function(req, res) {
    let userEmail = req.body.email;
    let empCode = req.body.empCode;
    const employeeRes = await employeeSchema.findOne({'email': userEmail, 'employeeId': empCode}).exec();
        if (!employeeRes) {
            res.send('Cannot found the user');
        }
     if(employeeRes) {
        const token = await jwt.sign({email: userEmail, role: 'admin'}, '!!@#$%SWQ', {expiresIn: '24h'});
        if(token) {
            const successRes = {
                message: 'Successfully get token',
                tokenData: token,
            }
            return res.status(200).send(successRes);
        }
     }
    });

// add employee

router.post('/add', adminValidation, async function(req, res) {
    const findDetail = await companySchema.findOne({'companyCode': req.body.companyCode}).exec();
    if (!findDetail) {
        return res.send('Cannot found company').status(400);
    }
    const UserSchema = new employeeSchema
    UserSchema.name = req.body.name;
    UserSchema.email = req.body.email;
    UserSchema.role = 'emp';
    UserSchema.employeeId = randomstring.generate(5);
    UserSchema.companyCode = req.body.companyCode;
    UserSchema.phoneNo = req.body.phoneNo;
    UserSchema.isReportManager = req.body.isReportManager;
    if (UserSchema.isReportManager) {
        UserSchema.toReportManager = req.body.toReportManager;
    }
    console.log(UserSchema);
    UserSchema.save(function(err, data) {
        if(err) {
            console.log('err', err);
        } else {
            const successRes = {
                status: 1,
                message: 'successfully added employee.',
            }
            return res.status(200).send(successRes);
        }
    });
})

// update employee
router.put('/update', adminValidation, async function(req, res) {
    console.log(req.body.empCode);
    const find = await employeeSchema.findOne({'employeeCode': req.body.empCode}).exec();
    if (find) {
        const updateRes = await employeeSchema.updateOne({employeeId: req.body.empCode}, {name: req.body.name, email: req.body.email, phoneNo: req.body.phoneNo}).exec();
        if (updateRes) {
            const successRes = {
                status: 1,
                message: 'successfully updated',
            }
            return res.status(200).send(successRes);
        }
    }
    res.send(d);
})

// get employee Detail

router.get('/get-employee', adminValidation, async function(req, res) {
    const empCode = req.body.employeeId;
    if (empCode) {
        const findDetail = await employeeSchema.findOne({'employeeId': req.body.empCode}).exec();
        if (findDetail) {
            const successRes = {
                status: 1,
                message: 'successfully get employee details',
                data: findDetail,
            }
            return res.status(200).send(successRes);
        }
    }
})

// delete employee

router.delete('/emp-delete', adminValidation, async function(req, res) {
    const empCode = req.body.employeeId;
    if (empCode) {
        const deleteEmp = await employeeSchema.deleteOne({'employeeId': req.body.employeeId}).exec();
        if (deleteEmp) {
            const successRes = {
                status: 1,
                message: 'successfully deleted employee',
            }
            return res.status(200).send(successRes);
        }
    }
})

// search employee by company

router.get('/emp-search', async function(req, res) {
    const companyCode = req.body.companyCode;
    const searchData = req.body.searchData;
    const findDetail = await companySchema.findOne({'companyCode': companyCode}).exec();
    if (!findDetail) {
        return res.send('Cannot found company').status(400);
    }
  // let regex = new RegExp(searchData,'i');
    console.log(typeof searchData);
     const empDetail = await employeeSchema.findOne({$or: [{'name': {$regex: '.*' + searchData + '.*'}}, typeof searchData == 'number' ? {'phoneNo': searchData} : {'employeeId': {$regex: '.*' + searchData + '.*'}} ]}).exec();
    if (empDetail) {
        const successRes = {
            status: 1,
            message: 'successfully get employee',
            data: empDetail,
        } 
        return res.status(200).send(successRes);
    }
    else {
        const errRes = {
            status: 1,
            message: 'successfully get employee',
            data: [],
        } 
        return res.status(200).send(errRes);
    }
})
// get employee by his report manager

router.get('/get-employee-by-report-manager', adminValidation, async function(req, res) {
    const empCode = req.body.employeeId;
    if (empCode) {
     //   const findDetail = await employeeSchema.findOne({'employeeId': req.body.empCode}).populate("employee").exec();
     const findDetail = await employeeSchema.aggregate([{$match: {"employeeId": empCode}},
            {
              $lookup:
                {
                  from: "employee",
                  localField: "toReportManager",
                  foreignField: "id",
                  as: "reportManagerList"
                }
           }
         ])
        if (findDetail) {
            const successRes = {
                status: 1,
                message: 'successfully get employee details',
                data: findDetail,
            }
            return res.status(200).send(successRes);
        } else {
            const errRes = {
                status: 1,
                message: 'successfully get employee details',
                data: [],
            }
            return res.status(200).send(errRes);
        }
    }
})



module.exports = router;