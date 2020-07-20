//inbuilt packages
const path = require("path");


//installed packages
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);

sharedsession = require("express-socket.io-session");
const fileUpload = require('express-fileupload');


//my packages
const db = require('./models/database')
//var db = require("./models/database")
const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
const miscRoute = require("./routes/misc");
const providerRoute = require("./routes/provider");
const userRoute = require("./routes/user");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

var options = {
	host: constants.host,
	port: 3306,
	user: constants.db_user,
	password: constants.db_pass,
	database: constants.database
};
var sessionStore = new MySQLStore(options);
app.use(fileUpload());



app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "uploads")));
var sessionObj = session({secret:"Ext9Deck5", resave:false, saveUninitialized:false, store:sessionStore})
app.use(sessionObj);
app.use(bodyParser.urlencoded({extended:false, limit: '50mb'}));

//console.log("started");

//setup routes
app.use("/admin", loginController.setupGlobals, loginController.checkAdminLoggedIn, adminRoute);
app.use("/auth", loginController.setupGlobals, authRoute);
app.use("/misc",loginController.setupGlobals,  miscRoute);

//app.use("/provider", loginController.checkProviderLoggedIn, providerRoute);

app.use("/provider", loginController.setupGlobals,  loginController.checkProviderLoggedIn,  providerRoute);
app.use("/user", loginController.setupGlobals, loginController.checkUserLoggedIn,  userRoute);

//app.get('/register', loginController.register);

app.use("/login", loginController.setupGlobals, loginController.loginRedirect, (req, res, next)=>{
    //check if the user is trying again
    var errMsg = "";
    var username = "";
    var message = "";
    
    req.session.error = null;
    res.render("login", {pageTitle:"Login", errorMsg:errMsg, username:username, message:message });
   
})
app.use("/logout", loginController.setupGlobals, (req, res, next)=>{
    req.session.isLoggedIn = false;
    req.session.userId = null;
    req.session.username = null;
    req.session.email = null;
    req.session.phone = null;
    req.session.privilege = null;
    res.redirect("/");
});

app.use("/contact-us", loginController.contact);
app.use("/privacy-policy", loginController.privacy);
app.use("/terms", loginController.terms);

//home controller. might be better in another file since this will grow dramatically.
app.use("/", loginController.setupGlobals, homeController.homepage)

app.use((req, res, next)=>{
    res.status(404).render("404", {pageTitle:"404"})
})

var server = app.listen(4000);

