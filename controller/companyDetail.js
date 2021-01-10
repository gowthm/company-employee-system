const express = require('express');
const router = express.Router();
const adminValidation = require('../auth/validation');
const companySchema = require('../model/company');
const randomstring = require('randomstring');

// add company

router.post('/add', adminValidation, function(req, res) {
    const CompanySchema = new companySchema;
    CompanySchema.companyName = req.body.companyName;
    CompanySchema.address = req.body.address;
    CompanySchema.companyCode = randomstring.generate(3);
    CompanySchema.phoneNo = req.body.phoneNo;
    console.log(CompanySchema);
    CompanySchema.save(function(err, data) {
        if(err) {
            console.log('err', err);
        } else {
            const successRes = {
                status: 1,
                message: 'successfully added company details.',
            }
            return res.status(200).send(successRes);
        }
    });
})

// update company
router.put('/update', adminValidation, async function(req, res) {
    console.log(req.body.companyCode);
    const find = await companySchema.findOne({'companyCode': req.body.companyCode}).exec();
    if (find) {
        const updateRes = await companySchema.updateOne({companyCode: req.body.companyCode}, {companyName: req.body.companyName, address: req.body.address, phoneNo: req.body.phoneNo}).exec();
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

// get company Detail

router.get('/get-company', adminValidation, async function(req, res) {
    const companyCode = req.body.companyCode;
    if (companyCode) {
        const findDetail = await companySchema.findOne({'companyCode': req.body.companyCode}).exec();
        if (findDetail) {
            const successRes = {
                status: 1,
                message: 'successfully get company details',
                data: findDetail,
            }
            return res.status(200).send(successRes);
        }
    }
})

// delete company

router.delete('/delete-company', adminValidation, async function(req, res) {
    const companyCode = req.body.companyCode;
    if (companyCode) {
        const deleteCompany = await companySchema.deleteOne({'companyCode': req.body.companyCode}).exec();
        if (deleteCompany) {
            const successRes = {
                status: 1,
                message: 'successfully deleted company',
            }
            return res.status(200).send(successRes);
        }
    }
})
module.exports = router;
