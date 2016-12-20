var express = require('express');
var Fuse = require('fuse.js');
var cheerio = require('cheerio');
var request = require('request');
var ent = require('ent');

var router = express.Router();


// -> <url_to_app>/api/
router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: 'This endpoint is pointless right now. Try /api/searchTerm but obviously replace searchTerm with your searchTerm' });
});


// -> <url_to_app>/api/searchTerm
router.get('/search', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var searchTerm = req.query.q;
    if (!searchTerm) {
    	res.status(400);
    	res.json({ message: "Invalid search query." });
    }

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
        var result = fuse.search(searchTerm);

        res.json(result);
    });
});




module.exports = router;