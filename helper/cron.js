const axios = require('axios');
const _ = require('underscore');
const moment = require('moment-timezone');
moment.tz.link("Asia/Calcutta|Asia/Kolkata");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
var Cookie = require('request-cookies').Cookie;
var countries = require('country-data').countries;
require('../models/crons');


const Winston = require("../logger");

const db = require("../config/db");


module.exports = {
    getAllCrons: function(req, callback) {
        const {Crons} = db;

        Crons.findAll({
            where: {},
            raw: true,}).then(crons => {
            return callback(null, crons);
        }).catch(err => {
            return callback(err, null);
        });
    },

    getCrons: function(req, callback) {
        const {Crons} = db;

        Crons.paginate({
            deleted_at: null
        }, {
            //lean:  true,
            limit: 10,
            virtuals: true,
            page: req.query.page ? req.query.page : 1
        }).then(function(Crons) {
            const context = {
                docs: Crons.docs.map(document => {
                    return {
                        id: document.id,
                        _id: document._id,
                        name: document.name,
                        description: document.description,
                        command: document.command,
                        second: document.second,
                        minute: document.minute,
                        hour: document.hour,
                        day: document.day,
                        month: document.month,
                        dayofweek: document.dayofweek,
                        status: document.status,
                        created_at: document.created_at,
                        deleted_at: document.deleted_at,
                    }
                })
            }
            Crons.docs = context.docs;
            return callback(null, Crons);
        }).catch(err => {
                return callback(err, null);
            }
        );
    },

    addCron: function (req, callback) {
        const {Crons} = db;

        let cron = {
            cronName: req.body.name,
            cronDesc: req.body.description,
            command: req.body.command,
            status: "true",
            second: req.body.second,
            minute: req.body.minute,
            hour: req.body.hour,
            day: req.body.day,
            month: req.body.month,
            dayofweek: req.body.dayofweek,
        }


        console.log("cron",cron)
        Crons.create(cron).then(function (err,cron) {
            console.log(cron)
            if (err) {
                callback(err, null);
            } else {
                callback(null, contactUs);
            }
        });
    },

    updateCron: function (req, callback) {
        const {Crons} = db;

        let newres = {};
        Crons.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(req.params.id)},
            req.updateData,
            {upsert: true, new: true},
            function (err, doc) {
                if (err) {
                   // console.log(err);
                    Winston.logger.error(`${err}`)
                    callback(err, null);
                } else {
                    //console.log('success');
                    Winston.logger.info(`${err}`)
                    callback(null, 'successfull');
                }
            });
    },

    editCron: function(req, callback) {
        const {Crons} = db;

        let newres = {};
        Crons.findOne({
            Id: req.params.id,
        }).lean().then(crondetail => {
            newres.status = 200;
            newres.message = 'success';
            newres.data = crondetail;
            return callback(null, newres);
        }).catch(err => {
            newres.status = 400;
            newres.message = 'fail';
            newres.data = ''
            callback(newres, null);
        });

    },

    cronURL : function (id){
       return new Promise((resolve) => {
           const {Crons} = db;

           Crons.find({_id: new mongoose.Types.ObjectId(id)}).then(crons => {
               return resolve(crons);
           }).catch(err => {
               return resolve(err);
           });
       })
    },


};
