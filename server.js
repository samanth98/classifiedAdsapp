const express = require('express')
const session = require('express-session')
var app = express()
var port = process.env.PORT|| 5555
const bodyParser = require('body-parser')

//sub server : staff, student
var user = express()
var admin = express()
var guest = express()

//mount the bp
app.use(bodyParser.urlencoded({
    extended: true
}))

//mount ejs
app.set("view engine", "ejs")
user.set("view engine", "ejs")
admin.set("view engine", "ejs")
guest.set("view engine", "ejs")

//mount session
user.use(session({
    secret: "user",
    resave: true,
    saveUninitialized: true
}))

admin.use(session({
    secret: "user",
    resave: true,
    saveUninitialized: true
}))
guest.use(session({
    secret: "user",
    resave: true,
    saveUninitialized: true
}))

//mount the sub server on to main server app
app.use("/user", user)
app.use("/admin", admin)
app.use("/guest", guest)

//mounting the static contents from the public folder and doing it at the main app
app.use(express.static('public'))
user.use(express.static('public'))
guest.use(express.static('public'))
admin.use(express.static('public'))

//mounting default middleware to student sub-server
user.use(function(req, res, next){
    console.log("Inside default middleware ")
    next()
})



//routes mapping
var userRoutes = require('./services/routes-user.js')
var adminRoutes = require('./services/routes-admin')
var guestRoutes = require('./services/routes-guest')

guestRoutes(guest)

userRoutes(user)
adminRoutes(admin)

app.listen(port, function(err){
    console.log("server started at ", port)
})
