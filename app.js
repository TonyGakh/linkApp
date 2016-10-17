const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    fs = require('fs-extra');
// by default dev port
var port = process.env.PORT || 8000;

// expose paths
app.use("/", express.static(__dirname + '/app'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));

app.use('/vars.js', function (request, response) {
    response.setHeader('content-type', 'text/javascript');
    var originalVars = fs.readJsonSync('app/vars.json');
    var string = 'vars = ' + JSON.stringify(originalVars) + ';';
    
    response.send(string);
    response.end();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post("/saveVars", function (req, res) {
    fs.writeJson('app/vars.json', req.body.vars, function(error, data){
        if(error){
            response.writeHead(500,{"Content-type":"text/plain"});
            response.end("Vars update fail!");
        }else{
            res.writeHead(201, { "Content-Type": "text/html" });
            res.end("Vars updated successfully!");

        }
    });
});

// Running server
app.listen(port, () => {
    console.log(`Application server starts at ${port} !`);
});

// Last thinks before exit
process.on('exit', () => {
    console.log('Application server ends !');
});
