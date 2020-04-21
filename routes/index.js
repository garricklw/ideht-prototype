const fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/galleryImages', function (req, res, next) {
    fs.readdir("./public/images/gallery/", (err, files) => {
        let fileUrls = [];
        for (let file of files) {
            fileUrls.push("/images/gallery/" + file.replace("?", "%3F"));
        }

        res.end(JSON.stringify(fileUrls));
    });
});

module.exports = router;
