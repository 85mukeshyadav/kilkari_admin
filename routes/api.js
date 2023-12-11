var express = require('express');
var router = express.Router();
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment-timezone');
moment.tz.link("Asia/Calcutta|Asia/Kolkata");
var path = require('path')
var FormData = require('form-data');


var {


} = require('../helper/api');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var cors = require('cors');
var app = express()
//app.use(cors()); //Enable All CORS Requests




module.exports = router;