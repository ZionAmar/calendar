const port = 7777;
const express = require('express');
const app = express();
app.use(express.json())
const dotenv = require("dotenv");
dotenv.config();

const body_parser = require('body-parser');
const path = require('path');
app.use(body_parser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.use(express.static('public'));
app.listen(port,()=>{console.log(`Now listen on port http://localhost:${port}`);
})

const curses = require('./routes/curses');
app.use('/curses',curses);

app.get('/', (req, res) => {
    res.render('main',{});
});
