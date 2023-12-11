var express = require('express');
const csv = require('csv-parser');
var router = express.Router();
var multer = require('multer');
const moment = require('moment-timezone');
moment.tz.link("Asia/Calcutta|Asia/Kolkata");
require('dotenv').config();
const _ = require('underscore');
const cron = require('node-cron');
const HlpErrorMessages = require('../helper/api');
const { exec } = require('child_process');
const cronMng = require('../helper/cronmanager');
var { 
    getCrons,addCron,updateCron,editCron,updateCron, getAllCrons,cronURL
} = require('../helper/cron');

const Winston = require("../logger");

router.get('/list', function (req, res, next) {
    getAllCrons(req, function(err,allCronList){
        console.log("allCronList",allCronList)
        if(!allCronList){
            allCronList = []
        }
        res.render('crons/list', {
            crons: allCronList,
    });
});
});


router.post('/addcron', function (req, res, next) {
    if(req.body.minute == ''){
        req.body.minute = '*';
    }

    if(req.body.hour == ''){
        req.body.hour = '*';
    }
 
    if(req.body.day == ''){
        req.body.day = '*';
    }

    if(req.body.month == ''){
        req.body.month = '*';
    }

    if(req.body.dayofweek == ''){
        req.body.dayofweek = '*';
    }
    
    addCron(req, async function (err, crons) {
        req.params = {
            module: "Cron",
            dataset: {"cron": req.body.name, "description": req.body.description},
        };
        var croninit = await cronMng.startIndividualCron(crons);
        res.redirect("/crons/list");

    });
});


router.get('/changestatus/:id/:name/:status', function (req, res, next) {
    var responsejson = {
        status:false,
        msg:'Some error in occur',
        data:''
    };
    req.updateData = {
        status:req.params.status
    };
    updateCron(req, function (err, crons) {
        if (err) {
            req.params.status_code = HlpErrorMessages.error_handler["cron"]["create_cron"]["status_code"]
            req.params.message = { pre: "DB error in change status cron", post: '' }
            req.params.isMailSend = true;
            req.params.error = err;
            HlpExceptionMailer.addLogAndExceptionEmail(req, function (err, result) {
                res.json(responsejson);
            });
        } else {
            req.session.message = "Successfully updated";
            req.params.status_code = HlpErrorMessages.error_handler["cron"]["success_create_cron"]["status_code"]
            req.params.message = { pre: "Created cron named ", post: '' }
            req.params.isMailSend = false;
            
            HlpExceptionMailer.addLogAndExceptionEmail(req, function (err, result) {
                if (err) {
                    //console.log(err);
                    Winston.logger.error(`${err}`)
                }
                req.params.mailtemplatename = "module_cron";
                req.params.variables = {
                    "email": process.env.ERROR_TO_MAIL,
                    "cur_date": Date(),
                    "module_name": "Cron",
                    "message": "Change status",
                    "value": req.params.name
                };
                responsejson.status = true;
                responsejson.msg =`Successfully Changed . ${req.params.id}`;
                var cronList = [];
                cronList = cronMng.systemCronList; //app.get('systemCronList');
                if(req.params.status == 'true'){
                    cronMng.startalreadyCreatedCron(req.params.id);
                }else{
                    cronMng.stopIndividualCron(req.params.id);
                }
                res.json(responsejson);
            });
        }
    });
});


router.get("/editcron/:id", (req, res) => {
    editCron(req, function (err, cronDet) {
        if (err) {
            return res.send(err);
        }
        return res.send(cronDet);
    });
});

router.post("/edit/:id", (req, res) => {
    var cronId = req.params.id;
    if(req.body.minute == ''){
        req.body.minute = '*';
    }

    if(req.body.hour == ''){
        req.body.hour = '*';
    }
 
    if(req.body.day == ''){
        req.body.day = '*';
    }

    if(req.body.month == ''){
        req.body.month = '*';
    }

    if(req.body.dayofweek == ''){
        req.body.dayofweek = '*';
    }

    req.updateData = {
        status:true,
        name:req.body.name,
        command:req.body.command,
        description:req.body.description,
        second:req.body.second,
        minute:req.body.minute,
        hour:req.body.hour,
        day:req.body.day,
        month:req.body.month,
        dayofweek:req.body.dayofweek,
    };
    updateCron(req, function (err, crons) {
        req.params = {
            module: "Cron",
            dataset: { "cron": req.body.name, "description": req.body.description },
        };
        if (err) {
            req.params.status_code = HlpErrorMessages.error_handler["cron"]["create_cron"]["status_code"];
            req.params.message = { pre: "DB error in creating cron", post: '' };
            req.params.isMailSend = true;
            req.params.error = err;
            HlpExceptionMailer.addLogAndExceptionEmail(req, function (err, result) {
                return res.send(err);
            });
        } else {
            req.session.message = "Successfully updated";
            req.params.status_code = HlpErrorMessages.error_handler["cron"]["success_create_cron"]["status_code"];
            req.params.message = { pre: "Updated cron named ", post: '' };
            req.params.isMailSend = false;
            HlpExceptionMailer.addLogAndExceptionEmail(req, async function (err, result) {
                if (err) {
                    //console.log(err);
                    Winston.logger.error(`${err}`)
                }
                req.params.mailtemplatename = "module_cron"
                req.params.variables = {
                    "email": process.env.ERROR_TO_MAIL,
                    "cur_date": Date(),
                    "module_name": "Cron",
                    "message": "Edited a Cron",
                    "value": req.params.name
                };
                cronMng.stopIndividualCron(cronId);
                cronMng.destroyCreatedCron(cronId)
                req.params.id = cronId;
                req.updateData._id = cronId;
                await cronMng.startIndividualCron(req.updateData);
                
                res.redirect("/crons/list");
            });
        }
    });
});


router.post('/addcroninstaller', function (req, res, next) {
    if(req.body.minute == ''){
        req.body.minute = '*';
    }

    if(req.body.hour == ''){
        req.body.hour = '*';
    }
 
    if(req.body.day == ''){
        req.body.day = '*';
    }

    if(req.body.month == ''){
        req.body.month = '*';
    }

    if(req.body.dayofweek == ''){
        req.body.dayofweek = '*';
    }
    
    addCron(req, function (err, crons) {
        req.params = {
            module: "Cron",
            dataset: { "cron": req.body.name, "description": req.body.description },
        };

        if (err) {
            req.params.status_code = HlpErrorMessages.error_handler["cron"]["create_cron"]["status_code"];
            req.params.message = { pre: "DB error in creating cron", post: '' };
            req.params.isMailSend = true;
            req.params.error = err;
            HlpExceptionMailer.addLogAndExceptionEmail(req, function (err, result) {
                return res.send(err);
            });
        } else {
            req.session.message = "Successfully updated";
            req.params.status_code = HlpErrorMessages.error_handler["cron"]["success_create_cron"]["status_code"];
            req.params.message = { pre: "Created cron named ", post: '' };
            req.params.isMailSend = false;
            HlpExceptionMailer.addLogAndExceptionEmail(req, async function (err, result) {
                if (err) {
                    //console.log(err)
                    Winston.logger.error(`${err}`)
                }
                req.params.mailtemplatename = "module_cron";
                req.params.variables = {
                    "email": process.env.ERROR_TO_MAIL,
                    "cur_date": Date(),
                    "module_name": "Cron",
                    "message": "Added a new cron",
                    "value": req.body.name
                };
                var croninit = await cronMng.startIndividualCron(crons);
                //res.redirect("/crons/list");
                res.send({'status':200,'message':'Cron Created Successfully'});
            });
        }
    });
});

module.exports = router;