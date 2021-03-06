const sequelize = require('sequelize');
const express = require('express');
const body_parser = require('body-parser');
require('body-parser-xml') (body_parser);
const cookie_parser = require('cookie-parser');
const config = require('./config.json');

let app = express();

app.use(express.static('view'));
app.use(body_parser.json());
app.use(body_parser.xml());
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(cookie_parser());

const db_connect = require('./connection/dbconnect') (sequelize);

let teamService = require('./services/team') (db_connect.team);
let userService = require('./services/user') (db_connect.user);
let contactService = require('./services/contact') (db_connect.contact);

let api = require('./controllers/api') (teamService, userService, contactService);

app.use('/api', api);

db_connect.sequelize.sync().then(
    () => {
        app.listen(process.env.PORT || 3300, () => {
            console.log("Server start");
        })
    }).catch((error) => {console.log(error)});

module.exports = app;