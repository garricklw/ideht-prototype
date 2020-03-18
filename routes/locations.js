const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://root:5BLRHCcKLqGn5qrz@ec2-3-82-154-56.compute-1.amazonaws.com:27017';

// Database Name
const loc_db_name = 'locations';
const client = new MongoClient(url, {useNewUrlParser: true});

let facility_coll;
let location_coll;

// Use connect method to connect to the server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const loc_db = client.db(loc_db_name);
    location_coll = loc_db.collection("local_examples");
    facility_coll = loc_db.collection("facility_examples");
});

/* GET a bunch of locations for testing. */
router.get('/locations', function (req, res, next) {
    location_coll.find({}).toArray(function (err, docs) {
        res.end(JSON.stringify(docs));
    })
});

router.get('/facilities', function (req, res, next) {
    facility_coll.find({'_id': 'AJU0'}).toArray(function (err, docs) {
        res.end(JSON.stringify(docs));
    })
});

module.exports = router;
