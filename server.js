
var methodOverride = require('method-override')
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var controller = require('./controllers/burgers_controller.js');
var db = require("./models");
// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;


var express = require('express');
var app = express();
 

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
controller(app);




// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});

