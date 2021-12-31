/*
<!--
    ########################################
    ## @author Benjamin Thomas Schwertfeger (2021)
    ## https://github.com/Crynetomega/Youtube-Downloader
    ############
-->
*/

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> I M P O R T S <----- ----- ----- */

const
    express = require('express'),
    http = require("http"),
    cors = require("cors"),
    path = require("path"),
    session = require('express-session'),
    compression = require('compression');

const
    errorHandler = require("./middlewares/errorHandler"),
    routes = require("./routes"),
    app = express();

const {
    PORT,
    DOMAIN
} = process.env.NODE_ENV === "prod" ? require("./config").prod : require("./config").dev;

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> S E T U P <----- ----- ----- */

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");
app.set("views", [
    path.join(__dirname, "views")
]);

app.use(cors());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/public", express.static(`${__dirname}/public`, {
    dotfiles: "allow"
}));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'password1234',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14 // 14 Days
    }
}))

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> R O U T E S <----- ----- ----- */

app.use(routes);

app.get('/', (req, res, next) => {
    var history = [];
    if (!(typeof req.session.downloads === "undefined" || !req.session.downloads || req.session.downloads.length === 0)) history = req.session.downloads;
    res.render("index", {
        DOMAIN: DOMAIN,
        PORT: PORT,
        HISTORY: history
    })
});

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> E R R O R - H A N D L E R <----- ----- ----- */

app.use(errorHandler);

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> E R R O R - H A N D L E R <----- ----- ----- */

http.createServer(app).listen(PORT, () => {
    console.log(`Listening on ${DOMAIN}:${PORT}`)
})

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> E O F <----- ----- ----- */