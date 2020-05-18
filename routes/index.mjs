import {DataFetchUtils} from "../public/common/utils/DataFetchUtils.mjs";
import express from "express";
import AWS from "aws-sdk"

// const fs = require('fs');
// var express = require('express');
export let indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

indexRouter.get('/galleryImages', function (req, res, next) {
    fs.readdir("./public/images/gallery/", (err, files) => {
        let fileUrls = [];
        for (let file of files) {
            fileUrls.push("/images/gallery/" + file.replace("?", "%3F"));
        }

        res.end(JSON.stringify(fileUrls));
    });
});

let serviceUrl = "";
export function fetchServiceUrl() {
    AWS.config.update({region: 'us-east-1'});
    const ecs = new AWS.ECS();
    const ec2 = new AWS.EC2();

    console.log("Retrieving service Url");

    let params = {
        cluster: "IDEHT",
        serviceName: "IDEHT_Proto_Service_Service"
    };
    let listPromise = ecs.listTasks(params);
    listPromise.send((err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Got Task List");

        let taskArn = data.taskArns[0];
        let describePromise = ecs.describeTasks({cluster: "IDEHT", tasks: [taskArn]});
        describePromise.send((err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Described Tasks");
            let networkInterfaceId = data.tasks[0].attachments[0].details[1].value;
            let describeNetwork = ec2.describeNetworkInterfaces({NetworkInterfaceIds: [networkInterfaceId]});
            describeNetwork.send((err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Got Network Interface Result");
                // serviceUrl = "http://0.0.0.0:8080/";
                serviceUrl = "http://" + data.NetworkInterfaces[0].Association.PublicDnsName + ":8080/";
                console.log("service Url: " + serviceUrl);
            })
        });
    });
}

indexRouter.get("/overview", function (req, res) {
    callService(req, res);
});

indexRouter.get("/posts", function (req, res) {
    callService(req, res);
});

indexRouter.get("/network", function (req, res) {
    callService(req, res);
});

indexRouter.get("/timeline_alerts", function (req, res) {
    callService(req, res);
});

indexRouter.get("/counts", function (req, res) {
    callService(req, res);
});

indexRouter.get("/locations", function (req, res) {
    callService(req, res);
});

indexRouter.get("/location_hydrate", function (req, res) {
    callService(req, res);
});

indexRouter.get("/word_freqs", function (req, res) {
    callService(req, res);
});

indexRouter.get("/image_links", function (req, res) {
    callService(req, res);
});


function callService(req, res) {
    // let originalUrl = req.originalUrl.replace("/?", "?");
    let fullUrl = serviceUrl + req.originalUrl;
    console.log("Fetching: " + fullUrl);
    DataFetchUtils.fetchString(fullUrl, (data) => {
        res.end(data);
    })
}
