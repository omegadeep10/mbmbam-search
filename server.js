var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Fuse = require('fuse.js');
var cheerio = require('cheerio');
var request = require('request');
var ent = require('ent');

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Port
var port = process.env.PORT || 8085;

//Routes
var router = express.Router();

//every route is under the /api/ endpoint
app.use('/api', router);

router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: 'This is the simple mbmbam search api.' });
});

router.get('/:searchTerm', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var url = "http://mbmbam.throwing-stones.net/list.php";

    request(url, function(error, response, html) {
        if (error) {
            console.log(error);
            res.json({ message: "Scraping error occurred." });
        }

        var $ = cheerio.load(html);
        var data = [];

        $("#results_table tbody").children().each(function(index, element) {
            
            var desc = ent.decode($(element).find("td:nth-child(3)").html()).replace(/\n/g, ""); //remove line breaks
            var talking_points = desc.match(/Suggested talking points:(.*)/i);

            //if talking points exist in desc, format data and return array of talking points
            if (talking_points) talking_points = talking_points[1].trim().split(',').map((x) => { return x.trim(); });


            var ep_title = ent.decode($(element).find("td > a").html());
            var data_title = ep_title.match(/:(.*)/);

            data.push({
                ep_title: ep_title,
                title: data_title ? data_title[1].trim() : "",
                date: $(element).find("td:nth-child(2)").html(),
                talking_points: talking_points ? talking_points : "",
                description: desc
            });
        });

        var options = {
            include: ["score", "matches"],
            shouldSort: true,
            threshold: 0.25,
            findAllMatches: true,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 3,
            keys: ["title", "talking_points"]
        };
        var fuse = new Fuse(data, options);
        var result = fuse.search(req.params.searchTerm);

        res.json(result);
    })
})



//start app
app.listen(port);
console.log(`App started on port ${port}`);