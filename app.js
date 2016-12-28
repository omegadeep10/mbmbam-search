var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');


//init app
var app = express();
var api_router = require('./routes/api');

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Port
var port = process.env.PORT || 8085;

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: 'This is the simple mbmbam search api. To use, make a request to /api/searchTerm' });
});


//every route is under the /api/ endpoint
app.use('/api', api_router);


//start app
app.listen(port);
console.log(`App started on port ${port}`);
console.log(process.env.DATABASE_URL);

pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err;
    console.log("Connection successful");

    client.query('SELECT * FROM ')
})