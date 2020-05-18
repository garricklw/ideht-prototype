import express from "express";
export const alertsRouter = express.Router();

import mongodb from "mongodb"
import assert from "assert"

// Connection URL
const url = 'mongodb://root:5BLRHCcKLqGn5qrz@ec2-3-82-154-56.compute-1.amazonaws.com:27017';

// Database Name
const client = new mongodb.MongoClient(url, {useNewUrlParser: true});

let alerts_coll;
let violence_val_coll;
let radical_val_coll;

let gab_post_coll;

let userPostCounts = [];
let networkPostCounts = [];
// Use connect method to connect to the server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const alert_db = client.db("alerts");
    alerts_coll = alert_db.collection("alerts");
    violence_val_coll = alert_db.collection("violence_vals")
});


/* GET location lookup. */
alertsRouter.get('/list', function (req, res, next) {
    alerts_coll.find({}).toArray(function (err, docs) {
        res.end(JSON.stringify(docs));
    })
});