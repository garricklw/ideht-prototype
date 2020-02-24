var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://root:5BLRHCcKLqGn5qrz@ec2-3-82-154-56.compute-1.amazonaws.com:27017';

// Database Name
const loc_db_name = 'locations';
const client = new MongoClient(url, {useNewUrlParser: true});

let location_coll;
let location_counts = {};
let max_count = 0;

// Use connect method to connect to the server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const loc_db = client.db(loc_db_name);
    location_coll = loc_db.collection("locations");

    const data_db = client.db("gab_posts");
    let data_coll = data_db.collection("posts");

    data_coll.find({"dataset": "WayneW67_crawl"}).sort("created_at", 1).limit(30000).toArray(function (err, docs) {
        console.log("Started counting locations");
        for (let doc of docs) {
            let entities = doc["named_entities"];
            for (let [ent, type] of Object.entries(entities)) {
                if (type === "FAC" || type === "GPE" || type === "LOC") {
                    if (!(ent in location_counts)) {
                        location_counts[ent] = 0;
                    }
                    location_counts[ent] = location_counts[ent] + 1;
                    if (location_counts[ent] > max_count) {
                        max_count = location_counts[ent]
                    }
                }
            }
        }
        console.log("Done counting locations");
    });
});

/* GET location lookup. */
router.get('/search/:location', function (req, res, next) {
    let loc = req.params.location;
    location_coll.find({"_id": loc}).toArray(function (err, docs) {
        if (docs.length < 1) {
            res.end("");
            return
        }
        res.end(JSON.stringify());
    })
});

router.get('/count/:location', function (req, res, next) {
    let loc = req.params.location;
    if (loc in location_counts) {
        res.end(location_counts[loc].toString());
    } else {
        res.end("0");
    }
});

router.get('/count_stats/', function (req, res, next) {
    let stats = {};
    stats["max"] = max_count;
    stats["perc_axis"] = [];
    stats["mean"] = Object.values(location_counts).reduce((a, b) => {
        return a + b;
    }) / Object.keys(location_counts).length;
    stats["stddev"] = Math.sqrt(Object.values(location_counts).reduce((sq, n) => {
        return sq + Math.pow(n - stats["mean"], 2);
    }, 0) / (Object.keys(location_counts).length - 1));

    let sorted = Object.values(location_counts).sort((a, b) => {
        return a - b;
    });
    let size = Object.values(location_counts).length;

    for (let i = 1; i <= 99; i++) {
        let idx = Math.floor((size / 100) * i);
        let value = sorted[idx];

        if (value > stats["mean"]) {
            stats["perc_axis"].push(sorted[idx]);
        }
    }

    res.end(JSON.stringify(stats));
});

/* GET a bunch of locations for testing. */
router.get('/locations', function (req, res, next) {
    location_coll.find({}).limit(500).toArray(function (err, docs) {
        res.end(JSON.stringify(docs));
    })
});

module.exports = router;
