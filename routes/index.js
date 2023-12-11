//import {IProductImage, IProductOption, IProductVariant} from "shopify-api-node";

var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const _ = require("underscore");
const moment = require('moment-timezone');
moment.tz.link("Asia/Calcutta|Asia/Kolkata");
mongoose.set('useFindAndModify', false);


/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('index', {title: 'Express'});


});


const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
const {addLogs} = require("../helper/api");
require('dotenv').config();

const app = express();
const port = 3000;

// Set up multer storage for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}`);
    },
});
const upload = multer({storage});

// Set up middleware to process CSV file
const processCSV = (req, res, next) => {
    const contacts = [];

    fs.createReadStream("csv-1692947353763")
        .pipe(csv())
        .on('data', (row) => {
            const contact = {
                urn: row.urn,
                name: row.name,
                state: row.state,
                district: row.district,
                healthblock: row.healthblock,
                healthfacility: row.healthfacility,
                taluka: row.taluka,
                village: row.village,
                lmp: row.lmp,
                opted_in: row.opted_in,
                status: row.status,
                subscriptionstatus: row.subscriptionstatus,
                creationdate: row.creationdate,
                testgroup: row.testgroup,
                consent: row.consent,
                pilotgroup: row.pilotgroup,
            };
            contacts.push(contact);
        })
        .on('end', () => {
            req.body.contacts = contacts;
            next();
        });
};

// Function to delay execution by given milliseconds
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Route to handle file upload and processing
router.get('/fileprocess', processCSV, async (req, res) => {
    console.log(req.body.contacts)
    const contacts = req.body.contacts;
    res.send('Requests processed successfully');

    for (const contact of contacts) {
        // GET request
        await delay(2000); // Add 0.5 second delay
        axios.get(`https://whatsapp.turn.io/v1/contacts/${contact.urn}/profile`, {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`,
                Accept: 'application/vnd.v1+json',
            },
        })
            .then((response) => {
                console.log('GET response:', response.data);
            })
            .catch((error) => {
                console.error('GET request error:', error.message);
            });

        // Execute PUT request for status equals "NEW"
        if (contact.status === 'New') {
            await delay(2000); // Add 0.5 second delay
            axios.put(`https://whatsapp.turn.io/v1/contacts/${contact.urn}/profile`,
                {
                    name: contact.name,
                    state: contact.state,
                    district: contact.district,
                    healthblock: contact.healthblock,
                    healthfacility: contact.healthfacility,
                    taluka: contact.taluka,
                    village: contact.village,
                    lmp: contact.lmp,
                    opted_in: contact.opted_in,
                    status: contact.status,
                    subscriptionstatus: contact.subscriptionstatus,
                    creationdate: contact.creationdate,
                    testgroup: contact.testgroup,
                    consent: contact.consent,
                    pilotgroup: contact.pilotgroup,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN}`,
                        Accept: 'application/vnd.v1+json',
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then(async (response) => {
                    console.log('PUT response:', response.data);

                    var addlog = {
                        name: contact.name,
                        mobileno: contact.urn,
                        status: response.status,
                        api_response: JSON.stringify(response.data)
                    }


                 await addLogs(addlog);
                    // Send message to contact
                    const messageData = {
                        to: contact.urn,
                        type: 'template',
                        template: {
                            namespace: 'e4f69439_f09d_478a_ab5f_c0b55f51d7df',
                            name: 'kilkari_core_test',
                            language: {
                                code: 'hi',
                                policy: 'deterministic',
                            },
                            components: [{
                                "type": "header",
                                "parameters": [
                                    {
                                        "type": "video",
                                        "video": {
                                            "id": "c776d66f-9a8f-425d-a821-3cadb26ad83a"
                                        }
                                    }
                                ]
                            },
                                {
                                    "type": "body",
                                    "parameters": [
                                        {
                                            "type": "text",
                                            "text": "हमें आपका फोन नंबर आपकी आशा (ASHA) से मिला है। भारत सरकार आप तक किलकारी (Kilkari) सेवा लाई है। आपको हर सोमवार और गुरूवार को गर्भावस्‍था के बारे में ज़रूरी जानकारी मिलेगी। ज़्यादा जानने के लिए ऊपर दिया गया वीडियो देखें👆🏼"
                                        }
                                    ]
                                }

                            ],
                        },
                    };

                    axios.post('https://whatsapp.turn.io/v1/messages', messageData, {
                        headers: {
                            Authorization: `Bearer ${process.env.TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(async (response) => {
                            var addlog = {
                                name: contact.name,
                                mobileno: contact.urn,
                                status: response.status,
                                api_response: JSON.stringify(response.data)
                            }
                             await addLogs(addlog);
                            console.log('Message sent:', response.data);
                        })
                        .catch((error) => {
                            console.error('Message sending error:', error.message);
                        });
                })
                .catch((error) => {
                    console.error('PUT request error:', error.message);
                });
        } else if (contact.status === 'STOP') {
            // Execute PATCH request to update status value for "STOP"
            await delay(2000); // Add 0.5 second delay
            axios.patch(
                `https://whatsapp.turn.io/v1/contacts/${contact.urn}/profile`,
                {
                    status: contact.status,
                    consent: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN}`,
                        Accept: 'application/vnd.v1+json',
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => {
                    console.log('PATCH response:', response.data);

                    // Send message to contact
                    const messageData = {
                        to: contact.urn,
                        type: 'template',
                        template: {
                            namespace: 'e4f69439_f09d_478a_ab5f_c0b55f51d7df',
                            name: 'lossofpregnancy',
                            language: {
                                code: 'hi',
                                policy: 'deterministic',
                            },
                            components: [],
                        },
                    };

                    axios
                        .post('https://whatsapp.turn.io/v1/messages', messageData, {
                            headers: {
                                Authorization: `Bearer ${process.env.TOKEN}`,
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(async (response) => {
                            var addlog = {
                                name: contact.name,
                                mobileno: contact.urn,
                                status: response.status,
                                api_response: JSON.stringify(response.data)
                            }
                             await addLogs(addlog);
                            console.log('Message sent:', response.data);
                        })
                        .catch((error) => {
                            console.error('Message sending error:', error.message);
                        });


                })
                .catch((error) => {
                    console.error('PATCH request error:', error.message);
                });
        } else {
            // Execute PATCH request to update status value for other status values
            await delay(2000); // Add 0.5 second delay
            axios
                .patch(
                    `https://whatsapp.turn.io/v1/contacts/${contact.urn}/profile`,
                    {
                        name: contact.name,
                        state: contact.state,
                        district: contact.district,
                        healthblock: contact.healthblock,
                        healthfacility: contact.healthfacility,
                        taluka: contact.taluka,
                        village: contact.village,
                        lmp: contact.lmp,
                        opted_in: contact.opted_in,
                        status: contact.status,
                        subscriptionstatus: contact.subscriptionstatus,
                        creationdate: contact.creationdate,
                        testgroup: contact.testgroup,
                        consent: contact.consent,
                        pilotgroup: contact.pilotgroup,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TOKEN}`,
                            Accept: 'application/vnd.v1+json',
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then(async (response) => {
                    var addlog = {
                        name: contact.name,
                        mobileno: contact.urn,
                        status: response.status,
                        api_response: JSON.stringify(response.data)
                    }
                        await addLogs(addlog);
                    console.log('PATCH response:', response.data);
                })
                .catch((error) => {
                    console.error('PATCH request error:', error.message);
                });
        }
    }

});

module.exports = router;