const express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
let app = express();
let routes = require('./routes/index.js');
mongoose.connect('mongodb://localhost/noteAddingAssignDb');
var db = mongoose.connection;
//handle mongodb error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to DataBase...");
});
app.use(session({
  secret: 'abcd',
  store: new MongoStore({
    mongooseConnection: db
  })
}));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(500).send({
    "Error": err.stack
  });
});
app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'));
});