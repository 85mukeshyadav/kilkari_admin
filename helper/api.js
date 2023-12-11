const axios = require('axios');
const _ = require('underscore');
const moment = require('moment-timezone');
moment.tz.link("Asia/Calcutta|Asia/Kolkata");
const NodeCache = require("node-cache");
const db = require("../config/db");


require('dotenv').config()



module.exports = {

    addLogs: function (addlog){
        return new Promise((resolve) => {
            const {Logs} = db;

            console.log("logs",addlog)
            Logs.create(addlog).then(function (reulthLogs) {
                console.log("reulthLogs",reulthLogs)
                resolve(reulthLogs)
            });


        })

    },
}