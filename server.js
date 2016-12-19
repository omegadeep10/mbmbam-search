var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fuse = require('fuse.js');
var cheerio = require('cheerio');
var request = require('request');

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Port
var port = process.env.PORT || 8085;

//Routes
var router = express.Router();
app.use('/api', router);

router.get('/', function(req, res) {
    res.json({ message: 'This is the simple mbmbam search api.' });
});

router.get('/:searchTerm', function(req, res) {
    var url = "http://mbmbam.throwing-stones.net/list.php";

    request(url, function(error, response, html) {
        if (error) {
            console.log(error);
            res.json({ message: "Scraping error occurred." });
        }

        res.send(html);
    })
})



//start app
app.listen(port);
console.log(`App started on port ${port}`);