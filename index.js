require("dotenv").config();
const express = require('express');
const app = express();

// CORS (Cross Origin Resource Sharing)
const cors = require('cors');
app.use(cors());

// body-parser always before app
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT;

const database = require('./config/database');
database.connect();

const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cookieParser('DCMM'));
app.use(session({ cookie: { maxAge: 60000 }}));

const routesApiV1 = require("./api/v1/routes/index.route");
routesApiV1(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});