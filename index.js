//npm i express body-parser ejs mysql2 slashes@2.0.0 md5 cookie-parser
const port = 7777;
const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.urlencoded({extended: false}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
global.jwt = require('jsonwebtoken');

let db_M = require('./database');
global.db_pool = db_M.pool;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "./views"));

global.addSlashes    = require('slashes').addSlashes;
global.stripSlashes  = require('slashes').stripSlashes;

global.was_logged = false;
const user_Mid = require("./middleware/user_Mid");

const actv_R = require('./Routers/Activity_R');
app.use('/A',[user_Mid.isLogged],actv_R);
const crs_R = require('./Routers/course_R');
app.use('/Crs',[user_Mid.isLogged],crs_R);
const usr_R = require('./Routers/users_R');
app.use('/U',[user_Mid.isLogged],usr_R);
const auth_R = require('./Routers/auth_R');
app.use('/',auth_R);


app.get('/', (req, res) => {
    res.render("index", {});
})

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});
