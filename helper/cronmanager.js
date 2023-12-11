var express = require('express');
const axios = require('axios');
const _ = require('underscore');
const moment = require('moment-timezone');
moment.tz.link("Asia/Calcutta|Asia/Kolkata");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
var Cookie = require('request-cookies').Cookie;
var countries = require('country-data').countries;
const { exec } = require('child_process');
//require('../models/crons');

const mongoose = require('mongoose');
//const Crons = mongoose.model('Crons');
const cron = require('node-cron');
const app = express();

//var systemCronList = [];
//app.set('systemCronList', systemCronList);
//app.locals.systemCronList = systemCronList;

var {
    getAllCrons
} = require('../helper/cron');
module.exports = {
    systemCronList : [],
    initAllSystemCrons: function () {
        return new Promise((resolve) => {
            var req = {};
            getAllCrons(req, async function (err, crons) {
                if(err) resolve(false);
                _.each(crons, async function (item, index) {
                    if(item.status){
                        var startIndcron = await module.exports.startIndividualCron(item);
                    }
                });
                resolve(true);
            });
        });
    },

    stopIndividualCron: function(cronId){
        var cronList = [];
        cronList = module.exports.systemCronList;
        if(typeof cronList != "undefined"){
            if(cronId!= ""){
            cronList[cronId].stop();
            }
        }
    },

    startalreadyCreatedCron: function(cronId){
        var cronList = [];
        cronList = module.exports.systemCronList;
        if(typeof cronList != "undefined"){
            if(cronId!= ""){
            cronList[cronId].start();
            }
        }
    },

    destroyCreatedCron: async function(cronId){
        var cronList = [];
        cronList = module.exports.systemCronList;
        cronList.splice(cronId);
        //unlink(cronList[cronId]);
    },

    startIndividualCron: function (cronDet){
        return new Promise((resolve) => {
            var cronparams = '';
            if(cronDet.second != ''){
                cronparams += cronDet.second+' ';
            }

            if(cronDet.minute != ''){
                cronparams += cronDet.minute;
            }else{
                cronparams += ' *';
            }

            if(cronDet.hour != ''){
                cronparams += ' '+cronDet.hour;
            }else{
                cronparams += ' *';
            }

            if(cronDet.day != ''){
                cronparams += ' '+cronDet.day;
            }else{
                cronparams += ' *';
            }

            if(cronDet.month != ''){
                cronparams += ' '+cronDet.month;
            }else{
                cronparams += ' *';
            }

            if(cronDet.dayofweek != ''){
                cronparams += ' '+cronDet.dayofweek;
            }else{
                cronparams += ' *';
            }
            if(cronDet.status){
                cronDet.command = cronDet.command.replace(process.env.ROOT_URL, "http://localhost:"+process.env.PORT)
                var task = cron.schedule(cronparams, () =>  {
                    //console.log('running a cron '+ cronDet.name);
                    exec(cronDet.command, (err, stdout, stderr) => {
                        if (err) {
                            //some err occurred
                            console.error(err);
                            resolve(false);
                        } else {
                            // the *entire* stdout and stderr (buffered)
                            // console.log(`stdout: ${stdout}`);
                            // console.log(`stderr: ${stderr}`);
                        }
                    });
                    }, {
                    scheduled: true,
                });
                var cronList = [];
                cronList = module.exports.systemCronList;
                cronList[cronDet._id] = task;
                task.start();
                app.locals.systemCronList = cronList;
            }

            resolve(true);
        });
    }
};
